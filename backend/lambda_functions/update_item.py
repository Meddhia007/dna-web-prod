import json
import os
import boto3
from boto3.dynamodb.conditions import Key

def handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table_name = os.environ.get('TABLE_NAME', 'WebsiteContent')
    table = dynamodb.Table(table_name)

    if event.get('httpMethod') == 'PUT':
        try:
            path_parts = [part for part in event.get('path', '').split('/') if part]
            if len(path_parts) != 3 or path_parts[0] != 'items':
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'message': 'Invalid path format. Expected /items/{item_type}/{item_id}'})
                }

            item_type = path_parts[1].upper()
            item_id = path_parts[2]

            body = json.loads(event.get('body', '{}'))

            update_expression_parts = []
            expression_attribute_values = {}
            expression_attribute_names = {}

            for key, value in body.items():
                # Avoid updating PK and SK
                if key not in ['PK', 'SK']:
                    update_expression_parts.append(f'#{key_alias} = :{key}')
                    expression_attribute_values[f':{key}'] = value
                    expression_attribute_names[f'#{key_alias}'] = key
                    key_alias = key.replace('.', '_') # Handle dots in attribute names

            if not update_expression_parts:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'message': 'No attributes to update'})
                }

            update_expression = 'SET ' + ', '.join(update_expression_parts)

            response = table.update_item(
                Key={
                    'PK': item_type,
                    'SK': item_id
                },
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expression_attribute_values,
                ExpressionAttributeNames=expression_attribute_names,
                ReturnValues='UPDATED_NEW'
            )

            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Item updated successfully', 'updated_attributes': response.get('Attributes')})
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
