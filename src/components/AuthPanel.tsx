type AuthPanelProps = {
  email: string;
  message: string | null;
  error: string | null;
  isSubmitting: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function AuthPanel({
  email,
  message,
  error,
  isSubmitting,
  onEmailChange,
  onSubmit
}: AuthPanelProps) {
  return (
    <section className="panel auth-panel">
      <div className="panel-heading">
        <h2>登入以同步資料</h2>
        <p>使用同一個 Email 登入後，手機與電腦就能共用同一份運動紀錄。</p>
      </div>

      <form className="auth-form" onSubmit={onSubmit}>
        <label>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="you@example.com"
          />
        </label>

        <button type="submit" disabled={isSubmitting || !email.trim()}>
          {isSubmitting ? '送出中...' : '寄送登入連結'}
        </button>
      </form>

      {message ? <p className="auth-message">{message}</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
    </section>
  );
}
