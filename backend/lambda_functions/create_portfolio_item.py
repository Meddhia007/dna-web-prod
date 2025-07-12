import json
import boto3
import uuid

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('DnaWebContent')

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        item_name = body['name']
        item_description = body['description']
        item_id = str(uuid.uuid4())

        table.put_item(
            Item={
                'contentType': 'portfolio',
                'id': item_id,
                'name': item_name,
                'description': item_description
            }
        )

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': 'Portfolio item added successfully', 'id': item_id})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': str(e)})
        }