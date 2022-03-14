import "../styles.css";

//this is to create boxes of all algos for displays
export default function AlgoCard({ startAlgo, setAlgo, className, algo }) {
  document.querySelector(".options").style.border = "none";
  return (
    <div
      className="algos"
      onClick={() => {
        setAlgo(algo);
      }}
    >
      {algo}
    </div>
  );
}
