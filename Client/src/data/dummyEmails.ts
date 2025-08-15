export interface Email {
  id: string;
  subject: string;
  from: { name: string; email: string };
  to: string;
  date: Date;
  isRead: boolean;
  isStarred: boolean;
  body: string;
  labels: string[];
  hasAttachments: boolean;
  attachments?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
  }>;
  priority: "high" | "normal" | "low";
}

export const dummyEmails: Email[] = [
  {
    id: "1",
    subject:
      "🎉 Wolt Gift Card Purchase Successful - ₪40.00 Added to Your Account!",
    from: { name: "Wolt", email: "noreply@wolt.com" },
    to: "user@example.com",
    date: new Date("2025-01-15T14:30:00"),
    isRead: false,
    isStarred: true,
    priority: "high",
    hasAttachments: true,
    attachments: [
      {
        id: "att_1",
        name: "gift_card_receipt.pdf",
        size: 245760, // 240 KB
        type: "application/pdf",
      },
    ],
    body: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTAwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTAgMTBIMzkwVjMwSDEwVjEwWiIgZmlsbD0iIzAwRDdGRiIvPgo8L3N2Zz4K" alt="Wolt" style="height: 40px;">
        </div>
        
        <h1 style="color: #00D7FF; font-size: 28px; margin-bottom: 20px; text-align: center;">Gift Card Successfully Purchased! 🎉</h1>
        
        <div style="background: linear-gradient(135deg, #00D7FF 0%, #0066CC 100%); padding: 20px; border-radius: 12px; color: white; margin: 20px 0;">
          <h2 style="margin: 0 0 15px 0; font-size: 20px;">Your Gift Card Details</h2>
          <table style="width: 100%; color: white;">
            <tr>
              <td style="padding: 8px 0;"><strong>Amount:</strong></td>
              <td style="padding: 8px 0; text-align: right; font-size: 18px; font-weight: bold;">₪40.00</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Gift Card Code:</strong></td>
              <td style="padding: 8px 0; text-align: right; font-family: 'Courier New', monospace; background: rgba(255,255,255,0.2); border-radius: 4px; padding: 8px;">WOLT-2025-ABCD-1234</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Valid Until:</strong></td>
              <td style="padding: 8px 0; text-align: right;">January 15, 2027</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Transaction ID:</strong></td>
              <td style="padding: 8px 0; text-align: right; font-family: 'Courier New', monospace;">#WF-TX-789123</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #28a745;">
          <h3 style="margin-top: 0; color: #28a745;">✅ Automatically Applied</h3>
          <p style="margin: 10px 0; line-height: 1.6;">Great news! This gift card has been automatically added to your Wolt account. You can start using it immediately for your next order!</p>
          <p style="margin: 10px 0; font-weight: 600;">Current Balance: ₪40.00</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #00D7FF; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Order Now with Your Gift Card</a>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border: 1px solid #ffeaa7; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #856404;">📱 Pro Tip</h4>
          <p style="color: #856404; margin-bottom: 0;">Save this email for your records. You can always check your gift card balance in the Wolt app under "Payment Methods".</p>
        </div>
        
        <hr style="border: none; height: 1px; background: #eee; margin: 30px 0;">
        
        <div style="text-align: center; color: #6c757d; font-size: 14px;">
          <p>Thank you for choosing Wolt! 🍔</p>
          <p>Questions? Contact us at <a href="mailto:support@wolt.com" style="color: #00D7FF;">support@wolt.com</a></p>
          <p style="margin-top: 20px;">This is an automated email from WoltFlow automation system.</p>
        </div>
      </div>
    `,
    labels: ["automation", "gift-card", "success"],
  },
  {
    id: "2",
    subject: "⚠️ URGENT: Automation Run Failed - Manual Intervention Required",
    from: { name: "WoltFlow Automation", email: "automation@woltflow.com" },
    to: "user@example.com",
    date: new Date("2025-01-14T15:22:00"),
    isRead: false,
    isStarred: false,
    priority: "high",
    hasAttachments: true,
    attachments: [
      {
        id: "att_2",
        name: "error_log.txt",
        size: 15360, // 15 KB
        type: "text/plain",
      },
      {
        id: "att_3",
        name: "screenshot_error.png",
        size: 524288, // 512 KB
        type: "image/png",
      },
    ],
    body: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #dc3545; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
          <h1 style="margin: 0; font-size: 24px;">🚨 Automation Failed</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Run #2785 encountered critical errors</p>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #856404;">📋 Failure Details</h2>
          <table style="width: 100%; color: #856404;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Run ID:</td>
              <td style="padding: 8px 0;">#2785</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Started:</td>
              <td style="padding: 8px 0;">January 14, 2025 at 3:20 PM</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Failed At:</td>
              <td style="padding: 8px 0;">January 14, 2025 at 3:22 PM</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Stage:</td>
              <td style="padding: 8px 0;">Buying Gift Card</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Error Code:</td>
              <td style="padding: 8px 0; font-family: 'Courier New', monospace;">AUTH_FAILED_401</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #721c24;">🔍 Error Analysis</h3>
          <p style="color: #721c24; margin: 10px 0;"><strong>Primary Issue:</strong> Cibus authentication failed with HTTP 401 error</p>
          <p style="color: #721c24; margin: 10px 0;"><strong>Likely Cause:</strong> Your Cibus password may have been changed or account locked</p>
          <p style="color: #721c24; margin-bottom: 0;"><strong>Additional Info:</strong> Multiple failed login attempts detected</p>
        </div>
        
        <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="margin-top: 0; color: #155724;">🛠️ Recommended Actions</h3>
          <ol style="color: #155724; margin: 15px 0; padding-left: 20px;">
            <li style="margin: 8px 0;"><strong>Check Cibus Account:</strong> Log into your Cibus account manually to verify credentials</li>
            <li style="margin: 8px 0;"><strong>Update Credentials:</strong> Go to WoltFlow Settings → Cibus Settings and update your password</li>
            <li style="margin: 8px 0;"><strong>Verify Balance:</strong> Ensure your Cibus account has sufficient balance (₪40+)</li>
            <li style="margin: 8px 0;"><strong>Check Account Status:</strong> Confirm your account isn't temporarily locked</li>
          </ol>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">Update Settings</a>
          <a href="#" style="background: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">Retry Run</a>
        </div>
        
        <div style="background: #e9ecef; padding: 15px; border-radius: 8px; margin: 25px 0;">
          <h4 style="margin-top: 0; color: #495057;">📎 Attachments</h4>
          <p style="color: #6c757d; font-size: 14px; margin-bottom: 0;">Error logs and screenshots have been attached to help with troubleshooting.</p>
        </div>
        
        <hr style="border: none; height: 1px; background: #ddd; margin: 30px 0;">
        
        <div style="text-align: center; color: #6c757d; font-size: 12px;">
          <p>If you need assistance, contact support at <a href="mailto:support@woltflow.com">support@woltflow.com</a></p>
          <p>WoltFlow Automation System • Run monitoring since 2024</p>
        </div>
      </div>
    `,
    labels: ["automation", "error", "urgent"],
  },
  {
    id: "3",
    subject: "📊 Weekly Report: 5 Successful Runs • ₪200 Saved This Week",
    from: { name: "WoltFlow Reports", email: "reports@woltflow.com" },
    to: "user@example.com",
    date: new Date("2025-01-12T09:00:00"),
    isRead: true,
    isStarred: false,
    priority: "normal",
    hasAttachments: false,
    body: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 28px;">📊 Weekly Summary</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">January 6 - 12, 2025</p>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin: 25px 0;">
          <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; text-align: center; flex: 1; margin-right: 10px;">
            <h3 style="margin: 0; color: #28a745; font-size: 32px;">5</h3>
            <p style="margin: 5px 0 0 0; color: #155724; font-weight: 600;">Successful Runs</p>
          </div>
          <div style="background: #fff3cd; padding: 20px; border-radius: 10px; text-align: center; flex: 1; margin: 0 5px;">
            <h3 style="margin: 0; color: #856404; font-size: 32px;">0</h3>
            <p style="margin: 5px 0 0 0; color: #856404; font-weight: 600;">Failed Runs</p>
          </div>
          <div style="background: #d1ecf1; padding: 20px; border-radius: 10px; text-align: center; flex: 1; margin-left: 10px;">
            <h3 style="margin: 0; color: #0c5460; font-size: 32px;">₪200</h3>
            <p style="margin: 5px 0 0 0; color: #0c5460; font-weight: 600;">Total Saved</p>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0;">
          <h2 style="margin-top: 0; color: #495057;">🎯 Performance Highlights</h2>
          <ul style="color: #495057; line-height: 1.8; margin: 15px 0;">
            <li><strong>Perfect Success Rate:</strong> 100% of runs completed successfully</li>
            <li><strong>Average Run Time:</strong> 2 minutes 34 seconds</li>
            <li><strong>Best Performance:</strong> Tuesday run completed in just 1m 52s</li>
            <li><strong>Consistency:</strong> All runs executed within scheduled time windows</li>
          </ul>
        </div>
        
        <div style="background: #e7f3ff; border-left: 4px solid #007bff; padding: 20px; margin: 25px 0;">
          <h3 style="margin-top: 0; color: #004085;">📈 Weekly Breakdown</h3>
          <table style="width: 100%; margin: 15px 0;">
            <tr style="border-bottom: 1px solid #dee2e6;">
              <td style="padding: 10px 0; color: #495057; font-weight: 600;">Monday</td>
              <td style="padding: 10px 0; text-align: right; color: #28a745;">✅ Success • ₪40</td>
            </tr>
            <tr style="border-bottom: 1px solid #dee2e6;">
              <td style="padding: 10px 0; color: #495057; font-weight: 600;">Tuesday</td>
              <td style="padding: 10px 0; text-align: right; color: #28a745;">✅ Success • ₪40</td>
            </tr>
            <tr style="border-bottom: 1px solid #dee2e6;">
              <td style="padding: 10px 0; color: #495057; font-weight: 600;">Wednesday</td>
              <td style="padding: 10px 0; text-align: right; color: #28a745;">✅ Success • ₪40</td>
            </tr>
            <tr style="border-bottom: 1px solid #dee2e6;">
              <td style="padding: 10px 0; color: #495057; font-weight: 600;">Thursday</td>
              <td style="padding: 10px 0; text-align: right; color: #28a745;">✅ Success • ₪40</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #495057; font-weight: 600;">Friday</td>
              <td style="padding: 10px 0; text-align: right; color: #28a745;">✅ Success • ₪40</td>
            </tr>
          </table>
        </div>
        
        <div style="background: linear-gradient(45deg, #007bff, #6610f2); color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 30px 0;">
          <h3 style="margin: 0 0 10px 0;">🏆 You're on fire!</h3>
          <p style="margin: 0; opacity: 0.9;">This is your third consecutive week with 100% success rate. Keep it up!</p>
        </div>
        
        <hr style="border: none; height: 1px; background: #dee2e6; margin: 30px 0;">
        
        <div style="text-align: center; color: #6c757d; font-size: 14px;">
          <p>Want to change your notification preferences? <a href="#" style="color: #007bff;">Update settings</a></p>
          <p style="margin-top: 20px;">WoltFlow • Automating your meal benefits since 2024</p>
        </div>
      </div>
    `,
    labels: ["automation", "summary", "weekly"],
  },
  {
    id: "4",
    subject: "⚡ Balance Alert: Cibus Account Running Low - Action Needed",
    from: { name: "WoltFlow Monitor", email: "alerts@woltflow.com" },
    to: "user@example.com",
    date: new Date("2025-01-10T11:15:00"),
    isRead: true,
    isStarred: false,
    priority: "high",
    hasAttachments: false,
    body: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #fd7e14 0%, #fd9843 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
          <h1 style="margin: 0; font-size: 24px;">⚡ Balance Alert</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your Cibus account needs attention</p>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #856404;">💰 Current Balance Status</h2>
          <table style="width: 100%; color: #856404;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Current Balance:</td>
              <td style="padding: 8px 0; text-align: right; font-size: 18px; color: #dc3545;">₪25.00</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Next Purchase:</td>
              <td style="padding: 8px 0; text-align: right;">₪40.00</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Scheduled:</td>
              <td style="padding: 8px 0; text-align: right;">Tomorrow at 2:00 PM</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #dc3545;">Shortfall:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #dc3545;">₪15.00</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #721c24;">⚠️ Potential Issues</h3>
          <ul style="color: #721c24; margin: 15px 0; padding-left: 20px;">
            <li style="margin: 8px 0;">Tomorrow's automation run will fail due to insufficient balance</li>
            <li style="margin: 8px 0;">You may miss out on ₪40 worth of meal benefits</li>
            <li style="margin: 8px 0;">Continuous failures could affect your automation schedule</li>
          </ul>
        </div>
        
        <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="margin-top: 0; color: #155724;">✅ Quick Solutions</h3>
          <ol style="color: #155724; margin: 15px 0; padding-left: 20px;">
            <li style="margin: 10px 0;"><strong>Contact HR:</strong> Request additional meal benefits for this month</li>
            <li style="margin: 10px 0;"><strong>Check Cibus App:</strong> Look for any pending benefits or bonuses</li>
            <li style="margin: 10px 0;"><strong>Temporary Pause:</strong> Skip tomorrow's run and resume when balance is sufficient</li>
            <li style="margin: 10px 0;"><strong>Reduce Amount:</strong> Temporarily lower gift card amount to ₪20</li>
          </ol>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #fd7e14; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">Pause Automation</a>
          <a href="#" style="background: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">Update Settings</a>
        </div>
        
        <div style="background: #e2e3e5; padding: 15px; border-radius: 8px; margin: 25px 0; text-align: center;">
          <h4 style="margin-top: 0; color: #495057;">📱 Pro Tip</h4>
          <p style="color: #6c757d; margin-bottom: 0; font-size: 14px;">Set up balance alerts to get notified when your balance drops below ₪50 to avoid future issues.</p>
        </div>
        
        <hr style="border: none; height: 1px; background: #ddd; margin: 30px 0;">
        
        <div style="text-align: center; color: #6c757d; font-size: 12px;">
          <p>This alert was triggered by our automated balance monitoring system</p>
          <p>WoltFlow • Smart meal benefit management</p>
        </div>
      </div>
    `,
    labels: ["alert", "balance", "urgent"],
  },
  {
    id: "5",
    subject: "🔒 Security Notice: New Login from Unknown Device",
    from: { name: "WoltFlow Security", email: "security@woltflow.com" },
    to: "user@example.com",
    date: new Date("2025-01-09T16:45:00"),
    isRead: true,
    isStarred: false,
    priority: "high",
    hasAttachments: false,
    body: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #495057; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
          <h1 style="margin: 0; font-size: 24px;">🔒 Security Alert</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">New device access detected</p>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #856404;">📱 Login Details</h2>
          <table style="width: 100%; color: #856404;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Time:</td>
              <td style="padding: 8px 0; text-align: right;">January 9, 2025 at 4:45 PM</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Device:</td>
              <td style="padding: 8px 0; text-align: right;">iPhone 15 Pro</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Browser:</td>
              <td style="padding: 8px 0; text-align: right;">Safari 17.0</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Location:</td>
              <td style="padding: 8px 0; text-align: right;">Tel Aviv, Israel</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">IP Address:</td>
              <td style="padding: 8px 0; text-align: right; font-family: 'Courier New', monospace;">192.168.1.105</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="margin-top: 0; color: #155724;">✅ Was This You?</h3>
          <p style="color: #155724; margin: 15px 0;">If you recognize this login, no action is needed. Your account remains secure.</p>
        </div>
        
        <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #721c24;">🚨 If This Wasn't You</h3>
          <p style="color: #721c24; margin: 15px 0;"><strong>Take immediate action:</strong></p>
          <ol style="color: #721c24; margin: 15px 0; padding-left: 20px;">
            <li style="margin: 8px 0;">Change your password immediately</li>
            <li style="margin: 8px 0;">Review your account activity</li>
            <li style="margin: 8px 0;">Check automation settings</li>
            <li style="margin: 8px 0;">Contact our security team</li>
          </ol>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #dc3545; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">Secure My Account</a>
          <a href="#" style="background: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">This Was Me</a>
        </div>
        
        <div style="background: #e9ecef; padding: 15px; border-radius: 8px; margin: 25px 0;">
          <h4 style="margin-top: 0; color: #495057;">🛡️ Security Best Practices</h4>
          <ul style="color: #6c757d; font-size: 14px; margin: 10px 0;">
            <li>Use strong, unique passwords</li>
            <li>Enable two-factor authentication when available</li>
            <li>Log out from public or shared devices</li>
            <li>Regularly review account activity</li>
          </ul>
        </div>
        
        <hr style="border: none; height: 1px; background: #ddd; margin: 30px 0;">
        
        <div style="text-align: center; color: #6c757d; font-size: 12px;">
          <p>This is an automated security notification from WoltFlow</p>
          <p>Questions? Contact security@woltflow.com</p>
        </div>
      </div>
    `,
    labels: ["security", "alert"],
  },
];
