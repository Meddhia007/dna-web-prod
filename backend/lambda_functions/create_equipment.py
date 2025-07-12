import json
import boto3
import uuid

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('DnaWebContent')

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        equipment_name = body['name']
        equipment_description = body['description']
        equipment_id = str(uuid.uuid4())

        table.put_item(
            Item={
                'contentType': 'equipment',
                'id': equipment_id,
                'name': equipment_name,
                'description': equipment_description
            }
        )

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': 'Equipment added successfully', 'id': equipment_id})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': str(e)})
        }