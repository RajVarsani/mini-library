//fetching the magazine data at the build time
import Papa from "papaparse";
import { useState, useEffect } from "react";
import Loading from "../components/Loading";

export default function Magazines() {
  const commonConfig = { delimiter: ";" };
  const [isLoading, setIsLoading] = useState(true);
  const [CSVData, setCSVData] = useState();

  const [searchText, setSearchText] = useState("");
  const [textType, setTextType] = useState("");

  const [authorName, setAuthorName] = useState("");

  function parseCSVData() {
    Papa.parse(
      "https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/magazines.csv",
      {
        ...commonConfig,
        header: true,
        download: true,
        complete: (result) => {
          setCSVData(result.data);
          setIsLoading(false);
        },
      }
    );
  }

  function compare_to_sort(x, y) {
    if (x.title < y.title) return -1;
    if (x.title > y.title) return 1;
    return 0;
  }
  useEffect(() => {
    parseCSVData();
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
    <div>
      <select
        className="select w-full max-w-xs"
        onChange={(event) => {
          setTextType(event.target.value);
        }}
        value={textType}
      >
        <option selected>Search by</option>

        <option value="isbn">ISBN</option>

        <option value="email">author email</option>
      </select>
      <input
        type="text"
        placeholder={`search by ${textType}`}
        className="input input-bordered w-full max-w-xs"
        onChange={(event) => {
          setSearchText(event.target.value);
        }}
        value={searchText}
        disabled={textType === "email" || textType === "isbn" ? false : true}
      />
      {
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th>ISBN</th>
                <th>Authors</th>
                <th>Published on</th>
              </tr>
            </thead>
            <tbody>
              {CSVData.filter((data) => {
                if (textType === "" || searchText.trim() == "") {
                  return data;
                } else if (textType === "isbn") {
                  return (
                    data.isbn && data.isbn.includes(searchText.toLowerCase())
                  );
                } else if (textType === "email") {
                  return (
                    data.authors &&
                    data.authors.includes(searchText.toLowerCase())
                  );
                }
              })
                .sort(compare_to_sort)
                .map((data, index) => {
                  return data.isbn ? (
                    <tr>
                      <th>{index}</th>
                      <td>{data.title}</td>
                      <td>{data.isbn}</td>
                      <td>{data.authors.replace(/,/g, ", ")}</td>
                      <td>{data.publishedAt}</td>
                    </tr>
                  ) : null;
                })}
            </tbody>
          </table>
        </div>
      }
    </div>
  );
}
