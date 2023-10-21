import axios from "axios";
import { useEffect, useState } from "react";

const FibPage = () => {
  const [seenIndexes, setSeenIndexes] = useState<{ number: number }[]>();
  const [values, setValues] = useState<Record<string, string>>({});
  const [index, setIndex] = useState("");

  const fetchValues = async () => {
    const { data } = await axios.get("/api/values/current");
    setValues(data);
  };

  const fetchIndexes = async () => {
    const { data } = await axios.get("/api/values/all");
    setSeenIndexes(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await axios.post("/api/values", { index });
    setIndex("");
  };

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, []);

  const renderValues = () => {
    return Object.entries(values).map(([key, value]) => (
      <div key={key}>
        For index {key} I calculated {value}
      </div>
    ));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label style={{ display: "inline-block", margin: "10px 0", fontSize: "16px" }} htmlFor="index-input">
          Enter your index
        </label>
        <br />
        <input
          style={{ height: "30px", fontSize: "16px" }}
          value={index}
          onChange={(e) => setIndex(e.target.value)}
          name="index"
          id="index-input"
          placeholder="index"
          type="text"
        />
        <button style={{ display: "inline-block" }} type="submit">
          Submit
        </button>
      </form>

      <h3>Indexes I have seen</h3>
      {seenIndexes?.map(({ number }) => number).join(", ")}

      <h3>Calculated values</h3>
      {renderValues()}
    </div>
  );
};

export default FibPage;
