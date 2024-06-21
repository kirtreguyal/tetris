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

function rotate(piece){
    let new_piece = [];

    for (let row_piece_index = 0; row_piece_index < piece.length; row_piece_index++) {
        new_piece.push([]);
    }

    for (let row_piece_index = piece.length - 1; 0 <= row_piece_index; row_piece_index--) {
        for (let column_piece_index = 0; column_piece_index < piece[row_piece_index].length; column_piece_index++) {
            new_piece[column_piece_index].push(piece[row_piece_index][column_piece_index])
        }    
    }

    return new_piece;
}

function collision(grid, piece_pos, piece){
    for(let row_piece = 0; row_piece < piece.length; row_piece++){
        for(let column_piece = 0; column_piece < piece[row_piece].length; column_piece++){
            if(piece[row_piece][column_piece] !== 0){
                let future_row = row_piece + piece_pos.x;
                let future_column = column_piece + piece_pos.y;

                if(future_column < 0 || future_column > grid[0].length - 1 || future_row > grid.length - 1 || grid[future_row][future_column] !== 0){
                    return true;
                }
            }
        }
    }

    return false;
}

function clearCompleteLine(grid){
    let completed_lines_count = 0;
    let new_row = [0,0,0,0,0,0,0,0,0,0];

    for(let row = 0; row < grid.length; row++){
        let is_line_complete = grid[row].every(cell => cell !== 0);
        if(is_line_complete){
            grid.splice(row, 1);
            grid.unshift(new_row);
            completed_lines_count++;
        }
    }

    return completed_lines_count;
}

function render(mock_grid, piece_pos, piece){
    const tetris = document.getElementById('tetris');
    tetris.innerHTML = "";
    let { x, y } = piece_pos;

    for (let row_piece = 0; row_piece < piece.length; row_piece++) {
        for (let column_piece = 0; column_piece < piece[row_piece].length; column_piece++) {
            if (piece[row_piece][column_piece] !== 0) {
                if (x + row_piece < mock_grid.length && y + column_piece < mock_grid[0].length) {
                    mock_grid[x + row_piece][y + column_piece] = piece[row_piece][column_piece];
                }
            }
        }
    }

    for(let row = 0; row < mock_grid.length; row++){
        for (let column = 0; column < mock_grid[row].length; column++){
            const grid_item = document.createElement('div');
            grid_item.classList.add('grid-item');
            grid_item.setAttribute("space", mock_grid[row][column]);
            grid_item.setAttribute("row", row + 1);
            tetris.appendChild(grid_item);
        }
    }
}

addEventListener("DOMContentLoaded", async (event) => {
    let score = 0;
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

    let piece_pos = { x: 0, y: 4 };
    let grid = createGrid(20, 10);
    let mock_grid = createGrid(20, 10);
    let piece = pieces[6]
    
    let is_game_ongoing = true;

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

    let reset_button = document.getElementById('reset');
    reset_button.addEventListener("click", () => {
        location.reload();
        // is_game_ongoing = true;
        // grid = createGrid(20, 10);
        // piece_pos = { x: 0, y: 4 };
        // score = 0;
        // start();
    });

    async function start(){
        /* Create a loop that loops throughout the game */
        while(is_game_ongoing){        
            await new Promise((resolve) => {
                let interval = 500;
                let render_environment = setInterval(() => {
                    mock_grid = JSON.parse(JSON.stringify(grid));
            
                    render(mock_grid, piece_pos, piece);
                    let colide = collision(grid, { x: piece_pos.x + 1, y: piece_pos.y }, piece); 
                    if(colide){
                        grid = JSON.parse(JSON.stringify(mock_grid));
                        piece = pieces[Math.floor(Math.random() * 6) + 1]
                        piece_pos = { x: 0, y: 4 };
                        let completed_lines_count = clearCompleteLine(grid);
                        score += (completed_lines_count * 100) * completed_lines_count;

                        const score_element = document.getElementById('score');
                        
                        score_element.innerText = `Score: ${ score }`;
                        
                        let new_piece_colide = collision(grid, { x: piece_pos.x, y: piece_pos.y }, piece); 
                        if(new_piece_colide){
                            const game_over = document.getElementById('game_over');
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
    start();
});
