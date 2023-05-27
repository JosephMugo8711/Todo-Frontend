import React from 'react';

export const TodoContainer = () => {
    return (

        <div>
            <div className="p-15">
                <input className="" type="text" placeholder="task name" maxLength="50" />
                <input className="" type="text" placeholder="task description" maxLength="50" />
                <label>
                    <input
                    type="checkbox"
                    // checked={completed}
                    // onChange={(e) => setCompleted(e.target.checked)}
                    />
                    Completed
                </label>
                <button type="submit">+</button>
	        </div>  	    
	        <div className="listWrapper">
	            <ul className="taskList">
	            </ul>
	        </div>
        </div>

    )
}