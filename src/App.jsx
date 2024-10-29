import React, { useState } from 'react';
import './index.css';

const totalGrids = 25;

const FruitGame = () => {
    const [minePositions, setMinePositions] = useState([]);
    const [revealedGrids, setRevealedGrids] = useState(Array(totalGrids).fill(false));
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState('');
    const [betAmount, setBetAmount] = useState('');
    const [betStatus, setBetStatus] = useState(false);
    const [winnings, setWinnings] = useState(0);
    const [totalFruits, setTotalFruits] = useState(1);
    const [showWinCard, setShowWinCard] = useState(false);

    const handleAmount = (e) => {
        setAmount(e.target.value);
    };

    const addAmount = () => {
        const numAmount = Number(amount);
        if (!isNaN(numAmount) && numAmount > 0) {
            setBalance((prevBalance) => prevBalance + numAmount);
            setAmount('');
        } else {
            alert('Please enter a valid number greater than 0');
        }
    };

    const handleBettingAmount = (e) => {
        const value = e.target.value;
        setBetAmount(value ? value : '');
    };

    const handleBetStatus = () => {
        const bet = Number(betAmount);
        if (bet > 0 && balance >= bet) {
            setBalance((prev) => prev - bet);
            setBetStatus(true);
            setWinnings(0);
            initializeGame();
        } else if (bet > 0 && balance < bet) {
            alert('Insufficient balance');
        } else {
            alert('Please enter a valid bet amount');
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
        setMinePositions(positions);
    };

    const calculateMultiplier = () => {
        let multiplier;
    
        if (totalFruits === 1) {
            multiplier = 1.1;
        } else if (totalFruits === 24) {
            multiplier = 6;
        } else {
            multiplier = 1.1 + ((totalFruits - 1) / 23) * (6 - 1.1);
        }
    
        // Round up to 2 decimal places
        return Math.ceil(multiplier * 100) / 100;
    };

    const calculateWinnings = (currentScore) => {
        const multiplier = calculateMultiplier();
        // Calculate the winnings
        const winnings = currentScore > 0 ? (Number(betAmount) * currentScore * multiplier) : 0;
        
        // Round up to 2 decimal places
        return Math.ceil(winnings * 100) / 100;
    };

    const handleGridClick = (index) => {
        if (gameOver || !betStatus) return;

        setRevealedGrids((prev) => {
            const newRevealed = [...prev];
            newRevealed[index] = true;
            return newRevealed;
        });

        if (minePositions.includes(index)) {
            setGameOver(true); // Game Over on hitting a mine
            setWinnings(0);
        } else {
            setScore((prevScore) => {
                const newScore = prevScore + 1;
                const newWinnings = calculateWinnings(newScore);
                setWinnings(newWinnings);
                return newScore;
            });
        }
    };

    const handleTotalFruitsChange = (e) => {
        const value = Number(e.target.value);
        // Check if the value is a valid number and is within the acceptable range
        if (value > 0 && value < totalGrids) {
            setTotalFruits(value);
        } else if (value <= 0) {
            setTotalFruits(""); // Ensure at least 1 fruit is set
        } else if (value >= totalGrids) {
            setTotalFruits(totalGrids - 1); // Ensure it doesn't exceed total grids
        }
    };

    const handleCashout = () => {
        if (gameOver) {
            alert('You cannot cash out after the game is over.');
            return;
        }

        const totalWinnings = calculateWinnings(score);
        setBalance((prevBalance) => prevBalance + totalWinnings);
        setGameOver(true);
        setBetStatus(false);
        setWinnings(totalWinnings);
        setShowWinCard(true); // Show the win card
    };

    const handleRestart = () => {
        setBetStatus(false);
        setWinnings(0);
        setShowWinCard(false); // Hide the win card when restarting
        initializeGame();
    };

    return (
        <div className='bg-gray-800 min-h-screen flex flex-col items-center p-3 text-white'>
            <h1 className='text-3xl font-bold mb-3'>moneyGain</h1>
            <div className='flex flex-col items-center mb-4'>
                <h2 className='text-xl mb-1'>Balance: Rs. {balance}</h2>
                <div className='flex flex-row p-1 gap-1'>
                    <input
                        type='text'
                        placeholder='Add amount'
                        value={amount}
                        onChange={handleAmount}
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
             <div className='flex justify-center items-center'>
             <h2 className='text-lg mb-1 score'>Score: {score}</h2>
             <h2 className='text-lg mb-2'>Winnings: Rs. {winnings}</h2>
                
             </div>
            
            <div className='grid grid-cols-5 gap-2 mb-3'>
                {Array.from({ length: totalGrids }, (_, index) => (
                    <div
                        key={index}
                        className={`flex justify-center items-center border-2 border-gray-600 rounded-lg w-16 h-16 cursor-pointer ${revealedGrids[index] ? (minePositions.includes(index) ? 'bg-red-600' : 'bg-green-600') : 'bg-gray-900'}`}
                        onClick={() => handleGridClick(index)}
                    >
                        {revealedGrids[index] && (minePositions.includes(index) ?
                            <span className='text-red-500 text-3xl'>💣</span> // Mine icon
                            : <span className='text-green-500 text-3xl'>🍏</span> // Fruit icon
                        )}
                    </div>
                ))}
            </div>
            <div className='flex items-center p-1 justify-start gap-2 w-52'>
                <div>
                    <h2 className='text-sm w-12'>Mines: </h2>
                </div>
                <div>
                    <input
                        type='number'
                        min='1'
                        max={totalGrids - 1}
                        value={totalFruits}
                        onChange={handleTotalFruitsChange}
                        className='border border-gray-400 p-1 w-36 rounded bg-gray-700 text-white text-sm'
                    />
                </div>
            </div>
            <div className='flex justify-center gap-1 items-center p-1'>
                <input
                    type='text'
                    placeholder='Bet amount'
                    value={betAmount}
                    onChange={handleBettingAmount}
                    className='border border-gray-400 p-1 w-36 rounded bg-gray-700 text-white text-sm'
                />
                {!gameOver && !betStatus && (  // Show Bet button before betting and only if game is not over
                    <button
                        onClick={handleBetStatus}
                        className='bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition text-sm'
                    >
                        Bet
                    </button>
                )}
                {betStatus && !gameOver && (  // Show Cashout button after betting
                    <button
                        onClick={handleCashout}
                        className='bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 transition text-sm'
                    >
                        Cashout
                    </button>
                )}
                {gameOver && (
                    <button
                        onClick={handleRestart}
                        className='bg-red-500 text-white p-1 rounded hover:bg-red-600 transition text-sm'
                    >
                        Restart
                    </button>
                )}
            </div>

            {/* Winning Card */}
            {showWinCard && (
                <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50'>
                    <div className='bg-gray-800 p-5 rounded-lg shadow-lg w-11/12 max-w-md'>
                        <h2 className='text-2xl font-bold mb-2'>You Won!</h2>
                        <p className='text-lg'>Amount: Rs. {winnings}</p>
                        <button
                            onClick={() => setShowWinCard(false)} // Hide card on button click
                            className='mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition'
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FruitGame;
