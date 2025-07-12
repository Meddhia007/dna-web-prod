import json
import os
import boto3
import uuid

def handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table_name = os.environ.get('TABLE_NAME', 'WebsiteContent')
    table = dynamodb.Table(table_name)

    if event.get('httpMethod') == 'POST':
        try:
            body = json.loads(event.get('body', '{}'))
            item_type = body.get('item_type', '').upper() # e.g., EQUIPMENT, TEAM_MEMBER

            if not item_type:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'message': 'item_type is required'})
                }

            item_id = str(uuid.uuid4())
            item = {
                'PK': item_type,
                'SK': item_id,
                **{k: v for k, v in body.items() if k != 'item_type'} # Add all other body fields
            }

            table.put_item(Item=item)

            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Item created successfully', 'item_id': item_id})
            }
        except json.JSONDecodeError:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Invalid JSON body'})
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': str(e)})
            }

    return {
        'statusCode': 400,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'message': 'Invalid request method'})
    }
