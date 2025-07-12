import json
import boto3
import uuid

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('DnaWebContent')

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        member_name = body['name']
        member_role = body['role']
        member_description = body['description']
        member_id = str(uuid.uuid4())

        table.put_item(
            Item={
                'contentType': 'teamMember',
                'id': member_id,
                'name': member_name,
                'role': member_role,
                'description': member_description
            }
        )

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': 'Team member added successfully', 'id': member_id})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': str(e)})
        }