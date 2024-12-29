import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/data");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const addItem = async () => {
    const id = Date.now().toString(); // Simple unique ID
    try {
      const currentDate = getFormattedDate();
      const response = await axios.post("http://localhost:5000/api/data", { id, content: newItem, date: currentDate });
      setData([...data, response.data]);
      setNewItem("");
    } catch (error) {
      console.error("Error adding item", error);
    }

    function getFormattedDate() {
      const now = new Date();

      // 取得年份、月份、日期
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份從 0 開始，所以要 +1
      const date = String(now.getDate()).padStart(2, '0');

      // 取得小時和分鐘
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');

      // AM/PM 判斷
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12; // 將 24 小時制轉為 12 小時制，且避免 0 點顯示為 0

      // 格式化時間字串
      return `${year}-${month}-${date} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/data/${id}`);
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-5 items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-5">Daily Record</h1>
      <section class="w-[60%]">
        <div className="flex space-x-3 mb-5">
          <textarea
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add new item"
            className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
          </textarea>
          <button
            onClick={addItem}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
          >
            Add
          </button>
        </div>
        <label for="">filter: </label>
        <input
          type="text"

          onChange={(e) => setFilterText(e.target.value)}
          placeholder="keyword"
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <ul className="w-full mt-5 bg-white shadow rounded-lg divide-y divide-gray-200">
          {data.filter(item => {
            return item?.content.includes(filterText) || item?.date.includes(filterText) || filterText == ""
          }).map((item) => (
            <li key={item.id} className="flex flex-wrap justify-between items-center p-4">

              <div class="w-full flex justify-between mb-2">
                <span className="text-gray-700" >{item.date}</span>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-red-500 hover:text-red-600 transition"
                >
                  Delete
                </button>
              </div>


              <span className="text-gray-700">{item.content}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default App;
