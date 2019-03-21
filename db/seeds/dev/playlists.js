exports.seed = function(knex, Promise) {
  return knex('playlist_favorites').del()
    .then(() => knex('playlists').del())
    .then(() => knex('favorites').del())
    .then(() => {
      return Promise.all([
        knex('favorites').insert([
          {name: 'song_1',artist_name: 'artist_1', genre: 'Pop',rating: 88},
          {name: 'song_2',artist_name: 'artist_2', genre: 'Rock',rating: 80},
          {name: 'song_3',artist_name: 'artist_3', genre: 'Country',rating: 81}
        ],'id')
        .then((favorites) => {
          return knex('playlists').insert([
            {playlist_name: 'playlist_1'},
            {playlist_name: 'playlist_2'},
            {playlist_name: 'playlist_3'}
          ], 'id')
          .then((playlists) => {
            return knex('playlist_favorites').insert([
              {playlist_id: playlists[0], favorite_id: favorites[0]},
              {playlist_id: playlists[1], favorite_id: favorites[1]},
              {playlist_id: playlists[2], favorite_id: favorites[2]}
            ])
          })
          .catch((error) => console.log(`Error seeding playlists: ${error}`))
        })
        .catch((error) => console.log(`Error seeding favorites: ${error}`)),
      ])
    })
    .catch(error => console.log(`Error deleting playlists_favorites: ${error}`));
};

// Have instructor review at later date

// exports.seed = function(knex, Promise) {
  //   return knex('playlist_favorites').del()
  //     .then(() => knex('favorites').del())
  //     .then(() => knex('playlists').del())
  //     .then(() => {
    //       return Promise.all([
      //         knex('playlists').insert( {
        //           playlist_name: 'THE HORROR'
        //         }, 'id')
        //           .then((favorites) => {
          //             return knex('favorites').insert( {
            //             name: 'Dont stop belibean',
            //             artist_name: 'Worst band',
            //             genre: 'Canadian Pop',
            //             rating: 5
            //           }, 'id')
            //             .then((playlists) => {
              //               return knex('playlist_favorites').insert(
                //                 {
                  //                   favorite_id: favorites[0], playlist_id: playlists[0]
                  //                 })
                  //               })
                  //             .then(() => console.log('Seeding complete!'))
                  //             .catch(error => console.log(`Error seeding this: ${error}`))
                  //             })
                  //       ])
                  //     })
                  //     .catch(error => console.log(`Error seeding data: ${error}`));
                  // };
                  // //