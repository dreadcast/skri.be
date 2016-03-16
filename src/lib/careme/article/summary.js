import { clean, stripTags, truncate } from 'superscore.string';

export default function summary(body){
	body = clean(body);
	body = stripTags(body);
	body = truncate(body, 300);

	return body;
}
