import "./StampAnimation.css";

interface StampAnimationProps {
  animate?: boolean;
}

const StampAnimation = ({ animate = false }: StampAnimationProps) => {
  return (
    <div
      className={`stamp-overlay ${animate ? "stamp-overlay--animate" : ""}`}
      aria-hidden="true"
    >
      {animate && (
        <div className="stamp-tool">
          <div className="stamp-tool__head">
            <div className="stamp-tool__shine" />
            <div className="stamp-tool__pad" />
          </div>
          <div className="stamp-tool__handle" />
        </div>
      )}

      <div className="stamp-imprint">
        <span>ĐÃ HOÀN THÀNH</span>
      </div>
    </div>
  );
};

export default StampAnimation;
