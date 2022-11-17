const db = require("../connection.js")

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
	if (!created_at) return { ...otherProperties };
	return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
	return arr.reduce((ref, element) => {
		ref[element[key]] = element[value];
		return ref;
	}, {});
};

exports.formatComments = (comments, idLookup) => {
	return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
		const article_id = idLookup[belongs_to];
		return {
			article_id,
			author: created_by,
			...this.convertTimestampToDate(restOfComment),
		};
	});
};

// exports.checkUsernames = (username) => {
	
// 	return db.query(`
//         SELECT * FROM users
//         WHERE username = $1;
//     `, [username]).then((users) => {

//         if (users.rows.length === 0){
//             return Promise.reject({
//                 status: 404,
//                 msg:"Invalid username given"
//             })
//         } else {
// 			return users
// 		}
//     })
// }


exports.checkCategory = (category) => {

	return db.query(`
		SELECT * FROM categories
		WHERE category = $1`,
		[category]
	).then((categories) => {
		if(categories.rows.length ===0){
			return Promise.reject({
				status: 404,
				msg:"invalid category given"
			})
		}
	})
}

exports.checkReviewsById = (review_id) => {

    return db.query(`
        SELECT * FROM reviews
        WHERE review_id = $1;
    `, [review_id]).then((reviews) => {

        if (reviews.rows.length === 0){
            return Promise.reject({
                status: 404,
                msg:"Invalid review id given"
            })
        } 
    })
}

