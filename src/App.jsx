import React, { useState, useEffect } from 'react';
import "./index.css"; // Ensure your CSS includes the necessary styles for the font

const totalGrids = 16; // Total number of grids
const totalFruits = 12; // Total number of fruits

const FruitGame = () => {
    const [fruitPositions, setFruitPositions] = useState([]);
    const [revealedGrids, setRevealedGrids] = useState(Array(totalGrids).fill(false));
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState("");
    const [betAmount, setBetAmount] = useState("");
    const [betStatus, setBetStatus] = useState(false);
    const [winnings, setWinnings] = useState(0);
    const [gamestatus, setGamestatus] = useState(false);
    const [cashoutStatus, setCashoutStatus] = useState(false);

    const handleAmount = (e) => {
        setAmount(e.target.value);
    };

    const addAmount = () => {
        const numAmount = Number(amount);
        if (!isNaN(numAmount) && numAmount > 0) {
            setBalance((prevBalance) => prevBalance + numAmount);
            setAmount("");
        } else {
            alert("Please enter a valid number greater than 0");
        }
    };

    const handleKeyPress = (event) => {
        if (!/^[0-9]*$/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Tab' && event.key !== 'Enter') {
            event.preventDefault();
            alert("Please enter numbers only");
        } else if (event.key === 'Enter') {
            addAmount(); // Call addAmount function on Enter key
        }
    };

    const handleBettingAmount = (e) => {
        const value = e.target.value;
        setBetAmount(value ? value : ""); 
    };

    const handleBetStatus = () => {
        const bet = Number(betAmount);
        if (bet > 0 && balance >= bet) {
            setBalance((prev) => prev - bet);
            setBetStatus(true);
            setWinnings(0); 
            initializeGame();
            setBetAmount(bet); // Update betAmount state
            setGamestatus(true);
        } else if (bet > 0 && balance < bet) {
            alert("Insufficient balance");
        } else {
            alert("Please enter a valid bet amount");
        }
    };

    const initializeGame = () => {
        setScore(0);
        setGameOver(false);
        setRevealedGrids(Array(totalGrids).fill(false));
        const positions = [];
        while (positions.length < totalFruits) {
            const randomPosition = Math.floor(Math.random() * totalGrids);
            if (!positions.includes(randomPosition)) {
                positions.push(randomPosition);
            }
        }
        setFruitPositions(positions);
    };

    const calculateWinnings = (currentScore) => {
        return currentScore > 0 ? (Number(betAmount) * currentScore * 0.5) : 0; 
    };

    const handleGridClick = (index) => {
        if (gameOver || !betStatus) return; // Prevent clicking if game is over or no active bet
    
        setRevealedGrids(prev => {
            const newRevealed = [...prev];
            newRevealed[index] = true;
            return newRevealed;
        });
    
        if (fruitPositions.includes(index)) {
            setScore(prevScore => {
                const newScore = prevScore + 1;
                const newWinnings = calculateWinnings(newScore); // Calculate winnings based on new score
                setWinnings(newWinnings); // Update winnings
                console.log("Current Score:", newScore);
                console.log("Bet Amount:", betAmount);
                console.log("New Winnings:", newWinnings);
                return newScore; // Return the new score
            });
        } else {
            setGameOver(true);
            setBetStatus(false); // End the game on wrong grid
            setWinnings(0); // Set winnings to 0 on wrong grid click
            console.log("Game over. Winnings set to 0.");
        }
    };

    const handleCashout = () => {
        const totalWinnings = calculateWinnings(score); // Use the function to calculate winnings
        setBalance((prevBalance) => prevBalance + totalWinnings); 
        setGameOver(true); 
        setBetStatus(false); 
        setWinnings(totalWinnings); // Set winnings for display
        setCashoutStatus(true); 
    };

    useEffect(() => {
        if (betStatus) {
            initializeGame();
        }
    }, [betStatus]);

    return (
        <div className='bg-gray-800 min-h-screen flex flex-col items-center justify-center p-3 text-white'>
            <h1 className='text-3xl font-bold mb-3'>Money Gain</h1>
            <div className='flex flex-col items-center mb-4'>
                <h2 className='text-xl mb-1'>Balance: Rs. {balance}</h2>
                <div className='flex flex-row p-1 gap-1'>
                    <input
                        type="text"
                        placeholder="Add amount"
                        value={amount}
                        onChange={handleAmount}
                        onKeyPress={handleKeyPress}
                        className='p-1 rounded bg-gray-700 text-white text-sm'
                    />
                    <button 
                        onClick={addAmount} 
                        className='bg-green-500 text-white p-1 rounded hover:bg-green-600 transition text-sm'
                    >
                        Add
                    </button>
                </div>
            </div>
            
            <h2 className="text-lg mb-1 score">Score: {score}</h2>
            <h2 className='text-lg mb-2'>Winnings: Rs. {winnings}</h2>
            <div className="grid grid-cols-4 gap-2 mb-3">
                {Array.from({ length: totalGrids }, (_, index) => (
                    <div
                        key={index}
                        className={`flex justify-center items-center border-2 border-gray-600 rounded-lg w-16 h-16 cursor-pointer ${revealedGrids[index] ? (fruitPositions.includes(index) ? 'bg-green-600' : 'bg-red-600') : 'bg-gray-900'}`}
                        onClick={() => handleGridClick(index)}
                    >
                        {revealedGrids[index] && (fruitPositions.includes(index) ? 
                            <img src="https://img.mensxp.com/media/content/2023/Aug/Image-3_Puneet-Superstar_Instagram_64d0e92f26850.jpeg?w=780&h=780&cc=1" className='h-full w-full' alt="" /> 
                            : <img src="https://exitplantx.com/images/Puneet-Superstar-image.jpg" className='h-full' alt="" />
                        )}
                    </div>
                ))}
            </div>
            <div className='flex flex-row sm:flex-col justify-center gap-1 items-center p-1'>
                <input
                    type="number"
                    placeholder="Enter bet amount"
                    onChange={handleBettingAmount}
                    value={betAmount}
                    className='border border-gray-400 p-1 rounded bg-gray-700 text-white text-sm'
                />
                <div className='flex flex-row p-1 gap-1'>
                    {gameOver ? (
                        <button 
                            onClick={initializeGame} 
                            className='bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition flex justify-center items-center text-sm'
                        >
                            Restart Game
                        </button>
                    ) : (
                        <button 
                            onClick={handleBetStatus} 
                            className='bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition flex justify-center items-center text-sm'
                        >
                            BET
                        </button>
                    )}
                    {betStatus && gamestatus && !gameOver && (
                        <button 
                            onClick={handleCashout} 
                            className='bg-purple-500 text-white p-1 rounded hover:bg-purple-600 transition flex justify-center items-center text-sm'
                        >
                            Cash Out
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FruitGame;
