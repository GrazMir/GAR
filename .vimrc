" Set Line numbes
set number
set relativenumber

" Set indentention 
filetype plugin indent on " enable file type detection
set autoindent
set expandtab
set tabstop=4
set shiftwidth=4
set softtabstop=4

" Enable moude 
set mouse+=a
if &term =~ '^screen'
    set ttymouse=xterm2
endif

" Set Searching a bit more efficiently
set hlsearch
set ignorecase
set smartcase
set incsearch

" Set text encoding and other stuff 
set encoding=utf-8
set linebreak

set wrap
set title
set nojoinspaces

set backspace=indent,eol,start
set noswapfile

" Set tab completion for buffers/files
set wildmode=longest,list
set wildmenu

" Turn on syntax highlighting.
syntax on

" Disable the default Vim startup message.
set shortmess+=I

" Always show the status line at the bottom, even if you only have one window open.
set laststatus=2

" Disable audible bell because it's annoying.
set noerrorbells visualbell t_vb=

" autoclose 
inoremap " ""<left>
inoremap ' ''<left>
inoremap ( ()<left>
inoremap [ []<left>
inoremap { {}<left>
inoremap {<CR> {<CR>}<ESC>O
inoremap {;<CR> {<CR>};<ESC>O

" open new split panes to right and bottom, which feels more natural
set splitbelow
set splitright

" quicker window movement
nnoremap <C-j> <C-w>j
nnoremap <C-k> <C-w>k
nnoremap <C-h> <C-w>h
nnoremap <C-l> <C-w>l

" save read-only files
command -nargs=0 Sudow w !sudo tee % >/dev/null



" auto commands
autocmd BufWritePost *.Xresources !xrdb <afile>
autocmd BufWritePost *config.def.h !sudo cp <afile> config.h && sudo make clean install
