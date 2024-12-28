const secretNumber = 42;

async function guessNumber(number) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return number === secretNumber;
}

(async () => {

    console.log("Guessing number" );

    const isCorrect = await guessNumber(41);

    if (isCorrect) {
        console.log("I guessed correctly :)");
    } else {
        console.log("I missed :(")
    }

})();

