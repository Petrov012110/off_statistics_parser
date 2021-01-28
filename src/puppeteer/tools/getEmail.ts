export const getEmail = () => {
    const newArrEmail: string[] = [];
    newArrEmail.push((document.getElementById('email') as any).value);
    console.log(newArrEmail);
    return newArrEmail;
}