/* This function will create an environment of tetris that is based on the number of rows and columns that is passed to it */
function createGrid(rows, cols) {
    let multi_dimentional_array = [];

    for(let row_index = 0; row_index < rows; row_index++){
        let row = []
        for (let column_index = 0; column_index < cols; column_index++) {
            row.push(0)
        }
        multi_dimentional_array.push(row);
    }

    return multi_dimentional_array;
}

/* This function will rotate the tetris block clockwise */
function rotate(piece){
    let new_piece = [];

    /* Determine the row count of the block base on the original block */
    for (let row_piece_index = 0; row_piece_index < piece.length; row_piece_index++) {
        new_piece.push([]);
    }

    /* Populate the new_piece to get the rotated block */
    for (let row_piece_index = piece.length - 1; 0 <= row_piece_index; row_piece_index--) {
        for (let column_piece_index = 0; column_piece_index < piece[row_piece_index].length; column_piece_index++) {
            new_piece[column_piece_index].push(piece[row_piece_index][column_piece_index])
        }    
    }

    return new_piece;
}

/* This function will check if the block will collide with other blocks that is already in the environment and check if the block will overlap outside the environment. */
function collision(grid, piece_pos, piece){
    /* Loop through all the indexes of the multi dimentional array block */
    for(let row_piece = 0; row_piece < piece.length; row_piece++){
        for(let column_piece = 0; column_piece < piece[row_piece].length; column_piece++){
            /* Check if the pin pointed index is a block piece */
            if(piece[row_piece][column_piece] !== 0){
                /* Place the block piece in its future placement */
                let future_row = row_piece + piece_pos.x;
                let future_column = column_piece + piece_pos.y;

                /* Check if the piece overlaps outside the environment or is colliding with the existing block */
                if(future_column < 0 || future_column > grid[0].length - 1 || future_row > grid.length - 1 || grid[future_row][future_column] !== 0){
                    return true;
                }
            }
        }
    }

    return false;
}

/* This will function will check for the completed tetris line in the environment */
function clearCompleteLine(grid){
    let completed_lines_count = 0;
    let new_row = [0,0,0,0,0,0,0,0,0,0];

    for(let row = 0; row < grid.length; row++){
        /* Check if all the columns in a row is not an empty space(0) */
        let is_line_complete = grid[row].every(cell => cell !== 0);
        if(is_line_complete){
            /* Remove the whole row form the environment */
            grid.splice(row, 1);
            /* Add a blank space row */
            grid.unshift(new_row);
            completed_lines_count++;
        }
    }

    return completed_lines_count;
}

/* This function will render the environment and the current tetris block piece in the DOM */
function render(mock_grid, piece_pos, piece){
    const tetris = document.getElementById('tetris');
    tetris.innerHTML = "";
    let { x, y } = piece_pos;

    /* Update the mock_grid with the piece's position and value */
    for (let row_piece = 0; row_piece < piece.length; row_piece++) {
        for (let column_piece = 0; column_piece < piece[row_piece].length; column_piece++) {
            /* Check if the current piece cell is not an empty space */
            if (piece[row_piece][column_piece] !== 0) {
                /* Update the mock_grid with the piece's position and value */
                /* Ensure that the position is within the grid boundaries */
                if (x + row_piece < mock_grid.length && y + column_piece < mock_grid[0].length) {
                    mock_grid[x + row_piece][y + column_piece] = piece[row_piece][column_piece];
                }
            }
        }
    }

    /* Loop through the mock_grid and create a div for each cell in the grid */
    for(let row = 0; row < mock_grid.length; row++){
        for (let column = 0; column < mock_grid[row].length; column++){
            /* Create a div for each cell in the grid */
            const grid_item = document.createElement('div');
            grid_item.classList.add('grid-item');
            /* Set the 'space' attribute to the value of the cell in the grid */
            grid_item.setAttribute("space", mock_grid[row][column]); 
            grid_item.setAttribute("row", row + 1);
            /* Add the div to the tetris element in the DOM */
            tetris.appendChild(grid_item);
        }
    }
}

addEventListener("DOMContentLoaded", async (event) => {
    const pieces = [
        [
            [0,0,1],
            [1,1,1],
            [0,0,0]
        ],
        [
            [2,0,0],
            [2,2,2],
            [0,0,0]
        ],
        [
            [0,3,3],
            [3,3,0],
            [0,0,0]
        ],
        [
            [4,4,0],
            [0,4,4],
            [0,0,0]
        ],
        [
            [0,5,0],
            [5,5,5],
            [0,0,0]
        ],
        [
            [6,6],
            [6,6]
        ],
        [
            [0,0,0,0],
            [7,7,7,7],
            [0,0,0,0],
            [0,0,0,0]
        ],
    ];

    let score = 0;
    let piece_pos = { x: 0, y: 4 };
    let grid = createGrid(20, 10);
    let mock_grid = createGrid(20, 10);
    let piece = pieces[6]
    let game_over = document.getElementById('game_over');
    let reset_button = document.getElementById('reset');
    let is_game_ongoing = true;
    
    async function start(){
        /* Check if the game is ongoing */
        while(is_game_ongoing){        
            /* Create a loop that loops throughout the game */
            await new Promise((resolve) => {
                let interval = 500;
                /* Set up an interval to render the game environment */
                let render_environment = setInterval(async () => {  
                    mock_grid = JSON.parse(JSON.stringify(grid)); 

                    render(mock_grid, piece_pos, piece); 
                    let colide = collision(grid, { x: piece_pos.x + 1, y: piece_pos.y }, piece); 
                    
                    /* Check if the piece will collide with the grids */
                    if(colide){
                        /* Update the grid with the current piece position and value */
                        grid = JSON.parse(JSON.stringify(mock_grid)); 
                        /* Choose a new random piece */
                        piece = pieces[Math.floor(Math.random() * 6) + 1];
                        /* Reset the position of the block */
                        piece_pos = { x: 0, y: 4 }; 

                        /* Check and clear the completed lines */
                        let completed_lines_count = clearCompleteLine(grid);
                        score += (completed_lines_count * 100) * completed_lines_count;

                        const score_element = document.getElementById('score'); 
                        score_element.innerText = `Score: ${ score }`; 

                        let new_piece_colide = collision(grid, { x: piece_pos.x, y: piece_pos.y }, piece);
                        /* Check if the incoming piece will collide in the environment */
                        if(new_piece_colide){ 
                            game_over.style.display = "block";
                            is_game_ongoing = false;
                        }
                        
                        clearInterval(render_environment);
                        resolve();
                    }
                    else{
                        piece_pos.x++;
                    }
                    
                }, interval);
            })
        };   
    }
    
    /* Listen for keydown events and handle the key inputs. */
    addEventListener("keydown", (event)=> {
        let mock_env = JSON.parse(JSON.stringify(grid));

        if(event.key === 'ArrowUp'){                             
            let new_piece = rotate(piece);
            if(!(collision(grid, { x: piece_pos.x + 1, y: piece_pos.y }, new_piece))){
                piece = new_piece;

                render(mock_env, piece_pos, piece);
            }
        }
        else if(event.key === 'ArrowDown'){
            if(!(collision(grid, { x: piece_pos.x + 1, y: piece_pos.y }, piece))){
                piece_pos.x += 1;

                render(mock_env, piece_pos, piece);
            }
        }
        else if(event.key === 'ArrowLeft'){
            if(!(collision(grid, { x: piece_pos.x, y: piece_pos.y - 1 }, piece))){
                piece_pos.y -= 1;

                render(mock_env, piece_pos, piece);
            }
        }
        else if(event.key === 'ArrowRight'){
            if(!(collision(grid, { x: piece_pos.x, y: piece_pos.y + 1 }, piece))){
                piece_pos.y += 1;
                
                render(mock_env, piece_pos, piece);
            }
        }
    });

    reset_button.addEventListener("click", () => {
        grid = createGrid(20, 10);
        mock_grid = createGrid(20, 10);
        piece_pos = { x: 0, y: 4 };
        score = 0;
        game_over.style.display = "none";
        
        if(!is_game_ongoing){
            is_game_ongoing = true;
            start();
        }
    });

    start();
});
