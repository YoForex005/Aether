export const loginService = async (userInput: string, password: string) => {
  const payload = { userName: userInput, password };

  const response = await fetch(
    "https://backend.boostbullion.com/user/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  const json = await response.json();

  if (response.status === 200 && json.status === true) {
    console.log("LOGIN SUCCESS:", json);    
  }

  return { status: response.status, json };
};
