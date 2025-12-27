import axios from "axios";




export const sendOtpService = async (value: string) => {
  try {
    const form = new URLSearchParams();

    // Auto detect if email or phone
    const isPhone = /^[0-9+]{6,15}$/.test(value);

    if (isPhone) {
      form.append("mobile", value);     // ⚡ phone for OTP
    } else {
      form.append("email", value);      // ⚡ email for OTP
    }

    const response = await axios.post(
      "https://backend.boostbullion.com/user/auth/send/otp",
      form,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("OTP SUCCESS:", response.data);

    return {
      ok: true,
      status: response.status,
      data: response.data,
      isPhone,
    };

  } catch (error: any) {
    console.log("OTP ERROR:", error.response?.data || error.message);

    return {
      ok: false,
      status: error.response?.status,
      data: error.response?.data,
    };
  }
};

// export const verifyOtpService = async (email: string, otp: string) => {
//   try {
//     const form = new URLSearchParams();
//     form.append("email", email);
//     form.append("otp", otp);

//     const response = await axios.patch(
//       "https://backend.boostbullion.com/user/auth/verify/otp",
//       form,
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );

//     console.log("VERIFY OTP SUCCESS:", response.data);

//     return {
//       ok: true,
//       status: response.status,
//       data: response.data,
//     };

//   } catch (error: any) {
//     console.log("VERIFY OTP ERROR:", error.message);
//     console.log("VERIFY OTP ERROR DATA:", error.response?.data);

//     return {
//       ok: false,
//       status: error.response?.status,
//       data: error.response?.data,
//     };
//   }

// };

export const verifyOtpService = async (value: string, otp: string) => {
  try {
    const form = new URLSearchParams();

    const isPhone = /^[0-9+]{6,15}$/.test(value);

    if (isPhone) {
      form.append("mobile", value);        // ⚡ phone verify
    } else {
      form.append("email", value);         // ⚡ email verify
    }

    form.append("otp", otp);

    const response = await axios.patch(
      "https://backend.boostbullion.com/user/auth/verify/otp",
      form,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("VERIFY OTP SUCCESS:", response.data);

    return {
      ok: true,
      status: response.status,
      data: response.data,
      isPhone,
    };

  } catch (error: any) {
    console.log("VERIFY OTP ERROR:", error.response?.data || error.message);

    return {
      ok: false,
      status: error.response?.status,
      data: error.response?.data,
    };
  }

};

// Reset password service


export const resetPasswordService = async (
  token: string,
  newPassword: string,
  cnfPassword: string
) => {
  try {
    const body = new URLSearchParams();
    body.append("newPassword", newPassword);
    body.append("cnfPassword", cnfPassword);

    const response = await axios.put(
      "https://backend.boostbullion.com/user/auth/reset/password",
      body,
      {
        headers: {
          "Authorization": token,        
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("RESET API RESPONSE:", response.data);

    return { ok: true, data: response.data };
  } catch (error: any) {
    console.log("RESET API ERROR:", error.response?.data || error.message);

    return {
      ok: false,
      data: error.response?.data || { message: "Network error" },
    };
  }
};
