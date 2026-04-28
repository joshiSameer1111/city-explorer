const movieForm = document.getElementById('movieNameForm');
const resultsElement = document.getElementById('movieresults');
const movieInput = document.getElementById('movieNameInput');

movieForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Don't use the server to process the form. Continue processing below
    resultsElement.style.display = 'none';
    const locationInputFromUser = movieInput.value.trim();

    // Don't continue if the location search is missing
    if(!locationInputFromUser) {
        resultsElement.innerHTML = '<p class="bg-yellow-500  p-2 text border-2 rounded-lg">Location is required</p>';
        resultsElement.style.display = 'block';
        return;
    }
    

    try {
        resultsElement.innerHTML = `
            <div class="flex item-center justify-center p-10">
                <i class="fas fa-spinner fa-spin text-4xl mr-4"></i>
                <p class="text-2xl">Loading data...</p>
            </div>
        `;
        resultsElement.style.display = 'block';

        const params = new URLSearchParams({
            search: locationInputFromUser
        });

        const apiUrl = `/movies?${params}`;
        const myApiResponse = await fetch(apiUrl);
        if (myApiResponse.status !== 200) {
            throw new Error(myApiResponse.statusText);
        }
        const data = await myApiResponse.json();


        // Display Restaurant Data

        const movieArr = data.results;
        console.log(movieArr);
        if (movieArr.length > 0) {
            resultsElement.innerHTML = `
            <div id="movieParent">
                <h3 class="text-xl font-medium my-4">You searched for "${locationInputFromUser}" </h3>
                <div id="movieSection" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
            </div>
        `;
            const movieSectionEl = document.getElementById('movieSection');
            movieArr.forEach(movie => {
                // const {name, rating, image_url, price, url, phone, categories, address, city, state, zip} = restaurant;
                const movieCard = `
                    <div class="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition transform hover:-translate-y-1">
                        <img src="${movie.poster_url || 'https://placehold.co/600x400?text=No+Image'}" alt="${movie.title}" class="w-full h-72 object-cover">
                        <div class="p-4">
                            <h4 class="font-semibold mb-2">${movie.title}</h4>
                            <p class="text-sm text-gray-600 mb-1">${movie.release_date || ''}</p>
                            <p class="text-sm text-gray-600 mb-1">${movie.overview || ''}</p>
                        </div>
                    </div>
                `;
                movieSectionEl.insertAdjacentHTML('beforeend', movieCard);
            });
        }


        // Movie Theater Data
        const movieTheaterArr = data.movieTheaterData;
        if (movieTheaterArr && movieTheaterArr.length > 0) {
            // Display the movie theaters
        } else {
            // Display "No movie theaters found" or "Failed to retrieve movie theaters
        }


    } catch (error) {
        // Display a message when something goes wrong
        resultsElement.innerHTML = `
            <div class="bg-red-200 border border-red-400 text-red-800 rounded-lg p-5 mt-5">
                <h3 class="font-semibold mb-2">Error!</h3>
                <p>Failed to fetch data. Please try again later.</p>
                <p class="text-sm mt-2 text-red-700">${error.message}</p>
            </div>
        `;
    }
})