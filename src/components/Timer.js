import { useEffect, useState } from "react";

const Timer = () => {
    const [timer, setTimer] = useState(300);
    const [isRunning, setRunning] = useState(false);
    const [isEditing, setEditing] = useState(false);

    const handleStart = () =>{
        setRunning(true);
        setEditing(false);
        let endTime = Date.now() + timer * 1000
        localStorage.setItem("endTime", endTime.toString());
    }

    const handleReset =() =>{
        setRunning(false);
        setTimer(300);
        setEditing(true)
        localStorage.removeItem("endTime");
    }

    const handleStop = () => {
        setRunning(false);
        setEditing(false);
        localStorage.removeItem("endTime");
    }

    useEffect(() => {
        let timeLeft;
        if(isRunning && timer > 0) {
            timeLeft = setInterval(() => {
                setTimer((prevTime) =>{
                    const newTime =  prevTime - 1;
                    if (newTime <= 0) {
                        setRunning(false);
                        localStorage.removeItem("endTime");
                    }
                    return newTime;
                })
            }, 1000)
        } else if(timer == 0 ) {
            clearInterval(timeLeft);
            setRunning(false);
        }
        return () => clearInterval(timeLeft)
    }, [isRunning, timer])

    useEffect(() => {
        const storeEndTime = localStorage.getItem("endTime");
        if (storeEndTime) {
            const remainingCount = Math.floor((parseInt(storeEndTime) - Date.now())/1000);
            if (remainingCount > 0) {
                setTimer(remainingCount);
                setRunning(true);
            }
            else {
                localStorage.removeItem("endTime");
            }
        }
    }, []);

    return (
        <div style={{alignItems:"center", marginLeft:"auto", marginRight:"auto", textAlign: "center" }}>
            <h1> CountDown Timer</h1>
            {isEditing ? (
                <input 
                type="text"
                value = {timer}
               onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) {
                        setTimer(val);
                    } else {
                        setTimer("");
                    }
                    }}
                autoFocus
                />
            ):
            (
                <h2> Counting Down: {Math.floor(timer/60)}m {timer % 60 != 0 && `${String(timer % 60).padStart(2, 0)}s`} </h2>
            )
            }   
            <button onClick={handleStart}>START</button>
            <button onClick={handleStop}>STOP</button>
            <button onClick={handleReset}>RESET</button>
        </div>
    );
}

export default Timer;