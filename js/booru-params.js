var boorus = {
	gelbooru: {
		uploadPath: '/index.php?page=post&s=add',
		fields: {
			file:	'upload',
			rating: 'rating',
			source: 'source',
			submit: 'submit',
			tags:   'tags',
			title:  'title'
		}
	},
	moebooru: {
		uploadPath: '/post/create',
		fields: {
			file:	'post[file]',
			parent: 'post[parent_id]',
			rating: 'post[rating]',
			source: 'post[source]',
			submit: 'commit',
			tags:   'post[tags]',
			token:	'authenticity_token'
		}
	}
};