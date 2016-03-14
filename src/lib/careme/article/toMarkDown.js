import Yaml from 'json2yaml';

export default function toMarkDown(attributes){
	attributes.medias = attributes.medias.toYAML();

	var attributes = Yaml.stringify(attributes),
		markdown = attributes.markdown;

	return attributes + markdown;
}
