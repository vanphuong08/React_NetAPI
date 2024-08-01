using MovieAPIDemo.Entities;
using System.ComponentModel.DataAnnotations;

namespace MovieAPIDemo.Models
{
    public class CreateMovieViewModel
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Nhập tên phim")]
        public string Title { get; set; }
        public string Description { get; set; }
        public List<int> Actors { get; set; }
        [Required(ErrorMessage = "Nhập tên tiếng")]
        public string Language { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string CoverImage { get; set; }
    }
}
