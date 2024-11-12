

export const mockCredentials = {
    credential: {
        type: "email",
        value: "example@gmail.com"
    },
    userId: "1234"
};


export const updateCredentials = async (newCredential) => {
   
    return { ...mockCredentials, credential: newCredential };
};
