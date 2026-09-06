import axios from "axios";

axios
  .get("http://127.0.0.1:8000/user/login", {
    body: {
      email:"abcde@gmail.com",
      password:"1234"
    },
  })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    console.log("Request completed");
  });