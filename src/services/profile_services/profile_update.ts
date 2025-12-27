import axios from "axios";

export const updateProfileService = async (
  token: string,
  payload: {
    name: string;
    mobile: string;
    countryCode: string;
    dob: string;
    gender: string;
    address: string;

  }
) => {
  try {
    const form = new URLSearchParams();

    form.append("name", payload.name);
    form.append("mobile", payload.mobile);
    form.append("countryCode", payload.countryCode);
    form.append("dob", payload.dob);
    form.append("gender", payload.gender);
    form.append("address", payload.address);
    // form.append("email", payload.email);

    const response = await axios.put(
      "https://backend.boostbullion.com/user/profile/update",
      form,
      {
        headers: {
          Authorization: token,   
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("UPDATE PROFILE SUCCESS:", response.data);

    return { ok: true, data: response.data };
  } catch (error: any) {
    console.log("UPDATE PROFILE ERROR:", error.response?.data || error.message);
    return {
      ok: false,
      data: error.response?.data || { message: "Network error" },
    };
  }
};


export const kycLevel1Service = async (
  token: string,
  payload: {
    name: string;
    dob: string;
    country: string;      
    countryCode: string; 
  }
) => {
  try {
    const form = new URLSearchParams();

    form.append("name", payload.name);
    form.append("dob", payload.dob);
    form.append("countryCode", payload.countryCode);  

  

    const response = await axios.put(
      "https://backend.boostbullion.com/user/profile/update",
      form,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("KYC LEVEL 1 SUCCESS:", response.data);
    return { ok: true, data: response.data };

  } catch (error: any) {
    console.log("KYC LEVEL 1 ERROR:", error.response?.data || error.message);
    return {
      ok: false,
      data: error.response?.data || { message: "Network error" },
    };
  }
};




export const kycLevel2UploadService = async (token: string, poi: any, poa: any) => {
    try {
        let formData = new FormData();

        formData.append("poi", {
            uri: poi.uri,
            name: poi.name,
            type: poi.type,
        } as any);

        formData.append("poa", {
            uri: poa.uri,
            name: poa.name,
            type: poa.type,
        } as any);

        const response = await axios.post(
            "https://backend.boostbullion.com/user/compliance/upload/doc",
            formData,
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        console.log("LEVEL 2 SUCCESS:", response.data);
        return { ok: true, data: response.data };

    } catch (err: any) {
        console.log("LEVEL 2 ERROR:", err.response?.data || err.message);
        return { ok: false, data: err.response?.data };
    }
};
