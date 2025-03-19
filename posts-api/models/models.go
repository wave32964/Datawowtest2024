package models

type Blog struct {
	ID       int    `json:"id"`
	Author   string `json:"author"`
	Avatar   string `json:"avatar"`
	Category string `json:"category"`
	Title    string `json:"title"`
	Excerpt  string `json:"excerpt"`
	Content  string `json:"content"`
	Comments int    `json:"comments"`
	TimeAgo  string `json:"timeAgo"`
}

type Comment struct {
	ID      int    `json:"id"`
	BlogID  int    `json:"blog_id"`
	Author  string `json:"author"`
	Avatar  string `json:"avatar"`
	Content string `json:"content"`
	TimeAgo string `json:"timeAgo"`
}
