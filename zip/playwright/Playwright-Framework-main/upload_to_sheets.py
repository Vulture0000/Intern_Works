import gspread
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
import csv
import os
import re

SHEET_ID = "1nFsJYTXTNQLP6Z2OHC6ToepfOCBjfLWalt7spY1E4iY"
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

# CSV files to upload as sheets - ordered by priority
CSV_FILES = [
    ("test-cases-admin-portal.csv", "Admin Portal"),
    ("test-cases-rbac.csv", "RBAC"),
    ("test-cases-testweb-portal.csv", "TestWeb Portal"),
    ("test-cases-installation-system-enhanced.csv", "Installation System"),
    ("test-cases-application-flows-enhanced.csv", "Application Flows"),
    ("test-cases-machine-configuration-enhanced.csv", "Machine Configuration"),
    ("test-cases-e2e-flows.csv", "E2E Flows"),
]


def get_authenticated_client():
    """Authenticate with OAuth and return gspread client."""
    creds = None
    token_file = os.path.join(os.path.dirname(__file__), "token.json")
    
    # Load saved token if exists
    if os.path.exists(token_file):
        import json
        with open(token_file, "r") as f:
            creds = Credentials.from_authorized_user_info(json.load(f), SCOPES)
    
    # If no valid creds, do OAuth flow
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            client_id = os.environ.get("GOOGLE_CLIENT_ID")
            client_secret = os.environ.get("GOOGLE_CLIENT_SECRET")
            if not client_id or not client_secret:
                raise RuntimeError(
                    "Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to authenticate."
                )

            flow = InstalledAppFlow.from_client_config(
                {
                    "installed": {
                        "client_id": client_id,
                        "client_secret": client_secret,
                        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                        "token_uri": "https://oauth2.googleapis.com/token",
                        "redirect_uris": ["http://localhost"],
                    }
                },
                SCOPES,
            )
            creds = flow.run_local_server(port=0)

        # Save token for next time
        with open(token_file, "w") as f:
            f.write(creds.to_json())
        print(f"✓ Token saved to {token_file}")
    
    return gspread.authorize(creds)

def sanitize_sheet_name(name):
    """Google Sheets sheet names must be ≤100 chars, no special chars issues."""
    # Truncate long names
    if len(name) > 100:
        name = name[:97] + "..."
    return name

def upload_csv_as_sheet(sh, csv_path, sheet_name):
    """Read a CSV file and upload it as a new sheet in the spreadsheet."""
    if not os.path.exists(csv_path):
        print(f"  ✗ File not found: {csv_path}")
        return
    
    print(f"\n  Reading {csv_path}...")
    
    # Read CSV
    with open(csv_path, "r", newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        rows = list(reader)
    
    if not rows:
        print(f"  ✗ Empty CSV: {csv_path}")
        return
    
    print(f"  Read {len(rows)} rows ({len(rows[0])} columns)")
    
    # Sanitize sheet name
    clean_name = sanitize_sheet_name(sheet_name)
    
    # Check if sheet already exists
    try:
        existing = sh.worksheet(clean_name)
        print(f"  Sheet '{clean_name}' already exists.")
        # Ask to replace
        import sys
        print(f"  Do you want to replace it? (y/n): ", end="", flush=True)
        answer = sys.stdin.readline().strip().lower()
        if answer == "y":
            sh.del_worksheet(existing)
            print(f"  Deleted existing sheet '{clean_name}'")
        else:
            print(f"  Skipping '{clean_name}'")
            return
    except gspread.exceptions.WorksheetNotFound:
        pass
    
    # Create new sheet
    new_sheet = sh.add_worksheet(title=clean_name, rows=max(len(rows) + 5, 100), cols=max(len(rows[0]), 10))
    print(f"  Created sheet '{clean_name}'")
    
    # Upload data
    new_sheet.update(range_name="A1", values=rows)
    print(f"  Uploaded {len(rows)} rows × {len(rows[0])} columns")
    
    # Format header row
    new_sheet.format("A1:Z1", {"textFormat": {"bold": True}, "backgroundColor": {"red": 0.9, "green": 0.9, "blue": 0.9}})
    
    # Auto-resize columns (approximate)
    for i in range(len(rows[0])):
        max_len = 15
        for row in rows[:50]:
            if i < len(row):
                max_len = max(max_len, min(len(str(row[i])), 80))
        new_sheet.format(f"{chr(65 + i)}:{chr(65 + i)}", {"textFormat": {"fontSize": 10}})

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    print("=== Google Sheets Uploader ===\n")
    print(f"Sheet ID: {SHEET_ID}")
    print(f"Base dir: {base_dir}")
    
    # Authenticate
    print("\nAuthenticating with Google...")
    try:
        gc = get_authenticated_client()
        print("✓ Authenticated successfully")
    except Exception as e:
        print(f"✗ Authentication failed: {e}")
        return
    
    # Open spreadsheet
    print(f"\nOpening spreadsheet {SHEET_ID}...")
    try:
        sh = gc.open_by_key(SHEET_ID)
        print(f"✓ Opened spreadsheet: '{sh.title}'")
    except Exception as e:
        print(f"✗ Failed to open spreadsheet: {e}")
        return
    
    # List existing sheets
    worksheets = sh.worksheets()
    print(f"\nExisting sheets ({len(worksheets)}):")
    for ws in worksheets:
        print(f"  - '{ws.title}' ({ws.row_count} rows × {ws.col_count} cols)")
    
    print(f"\n{'='*60}")
    print(f"Uploading {len(CSV_FILES)} CSV files as sheets...")
    print(f"{'='*60}")
    
    for csv_filename, sheet_name in CSV_FILES:
        csv_path = os.path.join(base_dir, csv_filename)
        print(f"\n[{sheet_name}]")
        upload_csv_as_sheet(sh, csv_path, sheet_name)
    
    print(f"\n{'='*60}")
    print("✓ Upload complete!")
    print(f"{'='*60}")
    
    # Final sheet list
    print(f"\nFinal sheets in '{sh.title}':")
    for ws in sh.worksheets():
        print(f"  - '{ws.title}' ({ws.row_count} rows)")

if __name__ == "__main__":
    main()
