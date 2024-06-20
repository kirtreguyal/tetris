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

function collision(mock_env, piece_pos, piece){
    for(let row_piece = 0; row_piece < piece.length; row_piece++){
        for(let column_piece = 0; column_piece < piece[row_piece].length; column_piece++){
            if(piece[row_piece][column_piece] !== 0){
                let future_row = row_piece + piece_pos.x;
                let future_column = column_piece + piece_pos.y;

                if(future_column < 0 || future_column > mock_env[0].length - 1 || future_row > mock_env.length - 1 || mock_env[future_row][future_column] !== 0 && piece[row_piece][column_piece] !== 0){
                    return true;
                }
            }
        }
    }

    return false;
}

function render(mock_env, piece_pos, piece){
    let response_data = { is_done: false }

    const tetris = document.getElementById('tetris');
    tetris.innerHTML = "";
    let { x, y } = piece_pos;

    for(let row = 0; row < mock_env.length; row++){
        for (let column = 0; column < mock_env[row].length; column++){
            if(row === x && column === y){
                let row_test = row;
                
                for(let row_piece = 0; row_piece < piece.length; row_piece++){
                    let column_test = column;
                    for(let column_piece = 0; column_piece < piece[row_piece].length; column_piece++){
                        if(piece[row_piece][column_piece] !== 0){
                            mock_env[row_test][column_test + column_piece] = piece[row_piece][column_piece];
                        }
                        else{
                            response_data.is_done = true;
                        }
                    }

                    row_test += 1;
                }
            }   

            const grid_item = document.createElement('div');
            grid_item.classList.add('grid-item');
            grid_item.setAttribute("space", mock_env[row][column]);
            grid_item.setAttribute("row", row);
            grid_item.setAttribute("id", row + column);
            tetris.appendChild(grid_item);
        }
    }

    return { ...response_data, mock_env: mock_env };
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

    let piece_pos = { x: 0, y: 4 };
    let grid = createGrid(20, 10);
    let mock_env = createGrid(20, 10);
    let piece = pieces[Math.floor(Math.random() * 6) + 1]
    
    let is_game_ongoing = true;

    addEventListener("keyup", (event)=> {
        if(event.key === 'ArrowUp'){                             
            /* TODO: rotate pieces */
            console.log("up");
        }
        else if(event.key === 'ArrowDown'){
            if(!(collision(mock_env, { x: piece_pos.x + 1, y: piece_pos.y }, piece))){
                piece_pos.x += 1;
            }
        }
        else if(event.key === 'ArrowLeft'){
            // if((piece_pos.y - 1) < 0 || (piece_pos.y - 1) > mock_env[0].length - 1){
            if(!(collision(mock_env, { x: piece_pos.x, y: piece_pos.y - 1 }, piece))){
                piece_pos.y -= 1;
            }
            console.log("left");
        }
        else if(event.key === 'ArrowRight'){
            // if(!(collision(mock_env, { x: piece_pos.x, y: piece_pos.y + 1 }, piece))){
                piece_pos.y += 1;
            // }
            console.log("right");
        }
    });

    /* Create a loop that loops throughout the game */
    while(is_game_ongoing){        
        await new Promise((resolve) => {

            let interval = 200;
            let render_environment = setInterval(() => {
                mock_env = JSON.parse(JSON.stringify(grid));
        
                render(mock_env, piece_pos, piece);
                let colide = collision(grid, { x: piece_pos.x + 1, y: piece_pos.y }, piece); 
                if(colide){
                    console.log("collided");
                    grid = JSON.parse(JSON.stringify(mock_env));;
                    piece = pieces[Math.floor(Math.random() * 6) + 1]
                    piece_pos = { x: 0, y: 4 };
                    let new_piece_colide = collision(grid, { x: piece_pos.x, y: piece_pos.y }, piece); 
                    if(new_piece_colide){
                        grid = createGrid(10,20);
                        // render(mock_env, piece_pos, piece);
                        is_game_ongoing = false;
                    }

                    clearInterval(render_environment);
                    resolve();
                }
                else{
                    console.log("haven't collided");
                    piece_pos.x++;
                }

            }, interval);
        })
    };      
});
