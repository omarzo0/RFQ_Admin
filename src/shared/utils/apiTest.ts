// Simple API test utility
export const testApiConnection = async (): Promise<boolean> => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

    console.log(
      "Testing API connection to:",
      `${baseUrl}/api/v1/admin/auth/login`
    );

    const baseResponse = await fetch(baseUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    console.log("Base URL Response Status:", baseResponse.status);
    const baseResponseText = await baseResponse.text();
    console.log("Base URL Response Body:", baseResponseText);

    const response = await fetch(`${baseUrl}/api/v1/admin/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: "test@test.com",
        password: "testpassword",
      }),
    });

    console.log("Login Endpoint Response Status:", response.status);
    console.log(
      "Login Endpoint Response Headers:",
      Object.fromEntries(response.headers.entries())
    );

    const responseText = await response.text();
    console.log("Login Endpoint Response Body:", responseText);

    return response.status !== 0;
  } catch (error) {
    console.error("API Test Error:", error);
    return false;
  }
};
