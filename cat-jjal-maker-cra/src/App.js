import logo from './logo.svg';
import React from 'react';
import Title from './components/title';
import './App.css';

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(
    `${OPEN_API_DOMAIN}/cat/says/${text}?json=true`
  );
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

console.log("야옹");

function CatItem(props) {
  console.log(props);
  return (
    <li>
      <img src={props.img} style={{ width: "150px" }} />
    </li>
  );
}

function Favorites({ favorites }) {
  if (favorites.length === 0)
    return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>;

  return (
    <ul className="favorites">
      {favorites.map((cat) => (
        <CatItem img={cat} key={cat} />
      ))}
    </ul>
  );
}

const MainCard = ({ img, onHeartClick, alreadyFavorite }) => {
  const heartIcon = alreadyFavorite ? "❤️" : "🤍";
  return (
    <div className="main-card">
      <img src={img} alt="고양이" width="400" />
      <button onClick={onHeartClick}>{heartIcon}</button>
    </div>
  );
};

const FormItem = ({ updateMainCat }) => {
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
  const [value, setValue] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  function handleInputChange(event) {
    const userValue = event.target.value;
    console.log(includesHangul(userValue));
    if (includesHangul(userValue)) {
      setErrorMessage("한글은 입력할 수 없습니다.");
    } else {
      setErrorMessage("");
    }
    setValue(userValue.toUpperCase());
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    setErrorMessage(""); // 에러 메시지 초기화, 궅이 else를 안해도 됨
    if (value === "") {
      setErrorMessage("빈 값으로 만들수 없습니다.");
      return;
    }
    updateMainCat(value);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        name="name"
        placeholder="영어 대사를 입력해주세요"
        value={value}
        onChange={handleInputChange}
      />
      <button type="submit">생성</button>
      <p style={{ color: "red" }}>{errorMessage}</p>
    </form>
  );
};



const App = () => {
  const CAT1 = "https://cataas.com/cat/HSENVDU4ZMqy7KQ0/says/react";
  const CAT2 = "https://cataas.com/cat/BxqL2EjFmtxDkAm2/says/inflearn";
  const CAT3 = "https://cataas.com/cat/18MD6byVC1yKGpXp/says/JavaScript";

  
  const [counter, setCounter] = React.useState(
    () => {
      return Number(jsonLocalStorage.getItem("counter"));
    }
  ); 
  
  const [mainCatImage, setCatImage] = React.useState(CAT1); // useState의 초기값을 인자로 넣음, 배열을 반환


  const [favorites, setFacorites] = React.useState(
    () => {
      return jsonLocalStorage.getItem("favorites") || [];
    }
  );
  const alreadyFavorite = favorites.includes(mainCatImage);

  async function setInitialCat() {
    const newCat = await fetchCat("First Cat");
    setCatImage(newCat);
  }

  React.useEffect(() => {
    setInitialCat();
  }, []); // 빈 배열을 넣어주면 처음에만 실행됨

  // setInitialCat();

  async function updateMainCat(value) {
    const newCat = await fetchCat(value);
    setCatImage(newCat);
    
    
    setCounter((prev) =>{
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter", nextCounter);
      return nextCounter;
    })
  }

  function handleHeartClick() {
    const nextFavorites = [...favorites, mainCatImage];
    setFacorites(nextFavorites);
    jsonLocalStorage.setItem("favorites", nextFavorites);
  }

  const counterTitle = counter === null ? "" : counter + "번째 ";

  return (
    <div>
      <Title>{counterTitle}고양이 가라사대</Title>
      <FormItem updateMainCat={updateMainCat} />
      <MainCard
        img={mainCatImage}
        onHeartClick={handleHeartClick}
        alreadyFavorite={alreadyFavorite}
      />
      <Favorites favorites={favorites} />
    </div>
  );
};


export default App;
