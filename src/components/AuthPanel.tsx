type AuthPanelProps = {
  email: string;
  otp: string;
  message: string | null;
  error: string | null;
  isSendingCode: boolean;
  isVerifyingCode: boolean;
  isOtpSent: boolean;
  onEmailChange: (value: string) => void;
  onOtpChange: (value: string) => void;
  onRequestOtp: (event: React.FormEvent<HTMLFormElement>) => void;
  onVerifyOtp: (event: React.FormEvent<HTMLFormElement>) => void;
  onResetOtp: () => void;
};

export default function AuthPanel({
  email,
  otp,
  message,
  error,
  isSendingCode,
  isVerifyingCode,
  isOtpSent,
  onEmailChange,
  onOtpChange,
  onRequestOtp,
  onVerifyOtp,
  onResetOtp
}: AuthPanelProps) {
  return (
    <section className="panel auth-panel">
      <div className="panel-heading">
        <h2>登入以同步資料</h2>
        <p>使用 Email 驗證碼登入後，手機與電腦就能共用同一份運動紀錄。</p>
      </div>

      {!isOtpSent ? (
        <form className="auth-form" onSubmit={onRequestOtp}>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <button type="submit" disabled={isSendingCode || !email.trim()}>
            {isSendingCode ? '送出中...' : '寄送驗證碼'}
          </button>
        </form>
      ) : (
        <form className="auth-form" onSubmit={onVerifyOtp}>
          <label>
            <span>Email</span>
            <input type="email" value={email} disabled />
          </label>

          <label>
            <span>驗證碼</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(event) => onOtpChange(event.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="輸入 6 碼驗證碼"
            />
          </label>

          <div className="auth-actions">
            <button type="submit" disabled={isVerifyingCode || otp.length !== 6}>
              {isVerifyingCode ? '驗證中...' : '確認登入'}
            </button>
            <button type="button" className="secondary-button" onClick={onResetOtp}>
              重新輸入 Email
            </button>
          </div>
        </form>
      )}

      {message ? <p className="auth-message">{message}</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
    </section>
  );
}
