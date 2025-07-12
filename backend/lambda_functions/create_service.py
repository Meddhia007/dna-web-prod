import json
import boto3
import uuid

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('DnaWebContent')

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        service_name = body['name']
        service_description = body['description']
        service_id = str(uuid.uuid4())

        table.put_item(
            Item={
                'contentType': 'service',
                'id': service_id,
                'name': service_name,
                'description': service_description
            }
        )

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': 'Service added successfully', 'id': service_id})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': str(e)})
        }