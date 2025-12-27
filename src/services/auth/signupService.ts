export const signupService = async (email: string, password: string) => {
  try {
    const response = await fetch(
      "https://backend.boostbullion.com/user/auth/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: email,
          password: password,
          country: "india", 
        }).toString(),
      }
    );

    const data = await response.json();
    return { ok: response.ok, data };
  } catch (error) {
    console.error("Signup Error:", error);
    return { ok: false, error };
  }
};
