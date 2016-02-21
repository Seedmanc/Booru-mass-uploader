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
		uploadPath: '/post/create.json',
		fields: {
			file:	'post[file]',
			parent: 'post[parent_id]',
			rating: 'post[rating]',
			source: 'post[source]',
			submit: 'commit',
			tags:   'post[tags]',
			token:	'authenticity_token'
		}
	},
	danbooru: {
		uploadPath: '/uploads.json',
		fields: {
			file:	'upload[file]',
			parent: 'upload[parent_id]',
			rating: 'upload[rating]',
			submit: 'commit',
			tags:   'upload[tag_string]'
		}
	}
};