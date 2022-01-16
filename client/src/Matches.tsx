import axios from "axios";
import React, { useState } from "react";
import { Match } from "./api";

export const Matches = ({
  matches,
  search,
}: {
  matches: Match[];
  search: string;
}) => {
  const [pageSize, setPageSize] = useState(5);
  const [flag, setFlag] = useState(true);
  const [apvDecCount, setapvDecCount] = useState(0);

  let filteredMatches = matches.filter((t) =>
    (
      t.borrower.user.firstName.toLowerCase() +
      t.borrower.user.lastName.toLowerCase() +
      t.companyName.toLowerCase() +
      t.borrower.user.email.toLowerCase()
    ).includes(search.toLowerCase())
  );

  const score = (score: number) => {
    if (score < 579) {
      return <p className="match__score--scoreC">C</p>;
    } else if (679 <= score) {
      return <p className="match__score--scoreA">A</p>;
    } else {
      return <p className="match__score--scoreB">B</p>;
    }
  };

  const toCurrency = (price: number, currency: string) => {
    if (currency === "NIS") {
      currency = "ILS";
    }
    return new Intl.NumberFormat("NIS", {
      currency: currency,
      style: "currency",
    }).format(price);
  };

  const changePage = () => {
    if (pageSize < 13) {
      setPageSize(5 + pageSize);
    } else {
      setPageSize(13);
      setFlag(false);
    }

    console.log(pageSize);
  };

  let dataServer;

  const fun = (id: string) => {
    setapvDecCount(1 + apvDecCount);

    axios
      .post(`http://localhost:8888/del`, {
        id,
      })
      .then((data) => {
        dataServer = data;
        console.log(dataServer);
        return dataServer;
      })
      .then(getData);
  };

  const getData = (dataServer: any) => {
    filteredMatches = dataServer.filter((t: any) =>
      (
        t.borrower.user.firstName.toLowerCase() +
        t.borrower.user.lastName.toLowerCase() +
        t.companyName.toLowerCase() +
        t.borrower.user.email.toLowerCase()
      ).includes(search.toLowerCase())
    );
  };

  return (
    <ul className="matches">
      <p>Approve and Decline matches: {apvDecCount} </p>
      {filteredMatches.slice(0, pageSize).map((match) => (
        <li key={match.id} className="match">
          <h5 className="match__title">{match.companyName}</h5>
          <div className="match__matchData">
            <div>
              <p className="match__matchData--userDate">
                <b>Credit score:</b>
                {match.borrower.creditScore}
              </p>
              <p className="match__matchData--userDate">
                <b>Full Name:</b>
                {`${match.borrower.user.firstName} ${match.borrower.user.lastName}`}
              </p>
              <p className="match__matchData--userDate">
                <b>Email:</b> {match.borrower.user.email}
              </p>
              <p className="match__matchData--userDate">
                <b>Amount Request: </b> {match.amountReq}
              </p>
              <p className="match__matchData--userDate">
                <b>Balance: </b>
                {toCurrency(
                  match.borrower.financeData.balance,
                  match.borrower.financeData.currency
                )}
              </p>
            </div>
          </div>
          <div className="match__score">
            {score(match.borrower.creditScore)}
          </div>
          <div className="match__btnApvDec">
            <button
              className="match__btnApvDec--apr"
              onClick={() => fun(match.id)}
            >
              Approve
            </button>
            <button
              className="match__btnApvDec--dec"
              onClick={() => fun(match.id)}
            >
              Decline
            </button>
          </div>
          <footer>
            <div className="match__meta-data">
              Created At {new Date(match.creationTime).toLocaleString()}
            </div>
          </footer>
        </li>
      ))}
      <button
        className="match__showMoreBtn"
        onClick={changePage}
        style={{
          display: flag === true ? "block" : "none",
        }}
      >
        Show more
      </button>
    </ul>
  );
};
