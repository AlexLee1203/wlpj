type GettingStartedProps = {
  onChoosePreset: () => void;
};

export default function GettingStarted({ onChoosePreset }: GettingStartedProps) {
  return (
    <section className="panel guide-panel">
      <div className="panel-heading">
        <h2>第一次使用先這樣開始</h2>
        <p>先建立一筆今天真的能做到的運動，不要一開始把計劃訂得太大。</p>
      </div>

      <ol className="guide-list">
        <li>先選一個最容易持續的運動，例如快走或瑜伽。</li>
        <li>輸入大概的分鐘數與熱量，不需要一開始就追求精算。</li>
        <li>完成後回來標記，讓你能看到當天完成率。</li>
      </ol>

      <button type="button" className="secondary-button" onClick={onChoosePreset}>
        幫我先填一筆範例
      </button>
    </section>
  );
}
