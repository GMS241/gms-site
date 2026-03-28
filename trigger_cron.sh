#!/bin/sh
# Script to trigger GMS Blog Generation
# Author: GMS AI Assistant (2026)

LOG_FILE="/var/log/gms_cron.log"

echo "--------------------------------------------------" >> $LOG_FILE
echo "🚀 Triggering GMS Cron at $(date)" >> $LOG_FILE

# Call the API with the Secret Key
# We use -k to ignore SSL errors if any (self-signed etc), though we have Let's Encrypt.
# We verify if the call was successful (HTTP 200)
HTTP_CODE=$(curl -k -s -o /dev/null -w "%{http_code}" -X POST https://gabonmanagementservices.ga/api/cron/generate-daily-post \
  -H "Authorization: Bearer changeme123")

if [ "$HTTP_CODE" -eq 200 ]; then
    echo "✅ Success: Cron triggered successfully (HTTP 200)." >> $LOG_FILE
else
    echo "❌ Error: Failed to trigger cron. HTTP Code: $HTTP_CODE" >> $LOG_FILE
    # Try local fallback if public fails?
    # echo "   Attempting local fallback..." >> $LOG_FILE
    # docker exec gms-site curl ...
fi

echo "🏁 Done." >> $LOG_FILE
echo "--------------------------------------------------" >> $LOG_FILE
