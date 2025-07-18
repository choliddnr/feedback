# Page snapshot

```yaml
- alert
- text: Login Don't have an account?
- link "Sign up":
  - /url: /auth/signup
- text: .
- button "Google"
- separator: or
- text: Email*
- textbox "Email*"
- text: Password
- textbox "Password"
- button "Show password"
- checkbox "Remember me":
  - checkbox
- text: Remember me
- button "Continue"
- region "Notifications (F8)":
  - list
- img
- button "Go to parent" [disabled]
- button "Open in editor"
- button "Close"
- button "Toggle Nuxt DevTools":
  - img
- text: 291 ms
- button "Toggle Component Inspector":
  - img
```