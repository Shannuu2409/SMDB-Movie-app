# The Movie Database

A modern movie browsing application built with React and Vite.

## Features

- Browse trending, new releases, and top-rated movies
- Search for movies
- View movie details and trailers
- Responsive design

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up TMDB API Credentials

To enable trailer functionality and movie data, you need to set up TMDB API credentials:

1. Go to [TMDB Settings](https://www.themoviedb.org/settings/api)
2. Create an account if you don't have one
3. Request an API key (v3) or access token (v4)
4. Create a `.env` file in the root directory with:

```env
# Option 1: API Key (v3)
VITE_TMDB_API_KEY=your_api_key_here

# Option 2: Access Token (v4) - Recommended
VITE_TMDB_ACCESS_TOKEN=your_access_token_here
```

**Note:** If you have both, the access token will be used first.

### 3. Run the Development Server

```bash
npm run dev
```

## Troubleshooting

### Trailer Button Not Working

If the "View Trailer" button is not working:

1. **Check API Credentials**: Ensure you have set up the `.env` file with valid TMDB credentials
2. **Check Console**: Open browser console to see any API errors
3. **Restart Dev Server**: After adding the `.env` file, restart the development server

### Common Issues

- **"Add your TMDB API credentials" message**: You need to set up the `.env` file
- **Trailer not loading**: Check if the movie has a trailer available on TMDB
- **Search not working**: Verify your API credentials are valid

## API Endpoints Used

- `/trending/movie/week` - Trending movies
- `/movie/upcoming` - New releases
- `/movie/top_rated` - Top rated movies
- `/movie/now_playing` - Latest movies
- `/search/movie` - Search movies
- `/movie/{id}/videos` - Movie trailers
- `/movie/{id}/credits` - Movie cast

## Technologies Used

- React 19
- Vite
- Tailwind CSS
- TMDB API
- Lucide React Icons
