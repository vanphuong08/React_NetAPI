using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieAPIDemo.Data;
using MovieAPIDemo.Entities;
using MovieAPIDemo.Models;
using System.Net.Http.Headers;

namespace MovieAPIDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private readonly MovieDbContext _context;
        private readonly IMapper _mapper;
        public MovieController(MovieDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;

        }

        [HttpGet]
        public IActionResult Get(int pageIndex = 0, int pageSize = 10)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var movieCount = _context.Movie.Count();
                var movieList = _mapper.Map<List<MovieListViewModel>>(_context.Movie.Include(x => x.Actors).Skip(pageIndex * pageSize).Take(pageSize).ToList());

                response.Status = true;
                response.Message = "Success";
                response.Data = new { Movies = movieList, Count = movieCount };

                return Ok(response);

            }
            catch (Exception ex)
            {
                response.Status = false;
                response.Message = "Something went wrong";
                return BadRequest(response);
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetMovieById(int id)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var movie = _context.Movie.Include(x => x.Actors).Where(x => x.Id == id).FirstOrDefault();

                if (movie == null)
                {
                    response.Status = false;
                    response.Message = "Record Not Exit";
                    return BadRequest(response);

                }

                var movieData = _mapper.Map<MovieDetailsViewModel>(movie);

                response.Status = true;
                response.Message = "Success";
                response.Data = movie;

                return Ok(response);

            }
            catch (Exception ex)
            {
                response.Status = false;
                response.Message = "Something went wrong";
                return BadRequest(response);
            }
        }
        [HttpPost]
        public IActionResult Post(CreateMovieViewModel model)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (ModelState.IsValid)
                {
                    var actors = _context.Person.Where(x => model.Actors.Contains(x.Id)).ToList();

                    if (actors.Count() != model.Actors.Count)
                    {
                        response.Status = false;
                        response.Message = "Invalid Actor assigned.";
                        return BadRequest(response);
                    }

                    var postedModel = _mapper.Map<Movie>(model);
                    postedModel.Actors = actors;

                    _context.Movie.Add(postedModel);
                    _context.SaveChanges();

                    var responseData = _mapper.Map<MovieDetailsViewModel>(postedModel);

                    response.Status = true;
                    response.Message = "Create Successfully";
                    response.Data = responseData;
                    return Ok(response);
                }
                else
                {
                    response.Status = false;
                    response.Message = "Validation failed";
                    response.Data = ModelState;
                    return BadRequest(response);
                }
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.Message = $"Something went wrong: {ex.Message}";
                return BadRequest(response);
            }
        }


        [HttpPut]
        public IActionResult Put(CreateMovieViewModel model)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (ModelState.IsValid)
                {

                    if (model.Id <= 0)
                    {
                        response.Status = false;
                        response.Message = "Invalid Movie Record";

                        return BadRequest(response);
                    }

                    var actors = _context.Person.Where(x => model.Actors.Contains(x.Id)).ToList();

                    if (actors.Count() != model.Actors.Count())
                    {
                        response.Status = false;
                        response.Message = "Invalid Actor assigned.";

                        return BadRequest(response);
                    }

                    var movieDetail = _context.Movie.Include(x => x.Actors).Where(x => x.Id == model.Id).FirstOrDefault();

                    if (movieDetail == null)
                    {
                        response.Status = false;
                        response.Message = "Invalid Movie Record.";

                        return BadRequest(response);
                    }
                    movieDetail.CoverImage = model.CoverImage;
                    movieDetail.Description = model.Description;
                    movieDetail.Language = model.Language;
                    movieDetail.ReleaseDate = model.ReleaseDate;
                    movieDetail.Title = model.Title;

                    //find removed actor
                    var removedActors = movieDetail.Actors.Where(x => !model.Actors.Contains(x.Id)).ToList();

                    foreach (var actor in removedActors)
                    {
                        movieDetail.Actors.Remove(actor);
                    }

                    //find added actors
                    var addedActors = actors.Except(movieDetail.Actors).ToList();


                    foreach (var actor in addedActors)
                    {
                        movieDetail.Actors.Add(actor);
                    }
                    _context.SaveChanges();

                    var responseData = new MovieDetailsViewModel
                    {
                        Id = movieDetail.Id,
                        Title = movieDetail.Title,
                        Actors = movieDetail.Actors.Select(y => new ActorViewModel
                        {
                            Id = y.Id,
                            Name = y.Name,
                            DateOfBirth = y.DateOfBirth,

                        }).ToList(),
                        CoverImage = movieDetail.CoverImage,
                        Language = movieDetail.Language,
                        ReleaseDate = movieDetail.ReleaseDate,
                        Description = movieDetail.Description
                    };

                    response.Status = true;
                    response.Message = "Update Successfully";
                    response.Data = responseData;
                    return Ok(response);
                }
                else
                {
                    response.Status = false;
                    response.Message = "Validation failed";
                    response.Data = ModelState;
                    return BadRequest(response);
                }
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.Message = "Something went wrong";
                return BadRequest(response);
            }
        }

        [HttpDelete]
        public IActionResult Delete(int id)
        {
            BaseResponseModel response = new BaseResponseModel();

            try
            {
                var movie = _context.Movie.Where(x => x.Id == id).FirstOrDefault();

                if (movie == null)
                {
                    response.Status = false;
                    response.Message = "Invalid Movie Record";
                    return BadRequest(response);
                }
                _context.Movie.Remove(movie);
                _context.SaveChanges();

                response.Status = true;
                response.Message = "Delete successfully";

                return Ok(response);
            }
            catch (Exception ex)
            {

                response.Status = false;
                response.Message = "Something went wrong";
                return BadRequest(response);
            }
        }

        [HttpPost]
        [Route("Upload-movie-poster")]
        public async Task<IActionResult> UploadMoviePoster(IFormFile imageFile)
        {
            try
            {
                var filename = ContentDispositionHeaderValue.Parse(imageFile.ContentDisposition).FileName.TrimStart('\"').TrimEnd('\"');
                string newPath = @"C:\GitHub_work_Home_net8\reactNet_API\Delete";

                if (!Directory.Exists(newPath)) 
                {
                    Directory.CreateDirectory(newPath);
                }
                string[] allowedImageExtensions = new string[]
                {
                    ".jpg", ".jpeg", ".png"
                };
                if (!allowedImageExtensions.Contains(Path.GetExtension(filename)))
                {
                    return BadRequest(new BaseResponseModel
                    {
                        Status = false,
                        Message = "Only .jpg, .jpeg and .png type files are allowed"
                    });
                }
                string newFileName = Guid.NewGuid() + Path.GetExtension(filename);  
                string fullFilePath = Path.Combine(newPath, newFileName);

                using (var stream = new FileStream(fullFilePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }
                return Ok(new { ProfileImage = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}/StaticFiles/{newFileName}" });
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponseModel
                {
                    Status = false,
                    Message = "Error Occured"
                });
            }
        }
    }
}
