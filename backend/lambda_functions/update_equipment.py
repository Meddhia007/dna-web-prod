import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('DnaWebContent')

def lambda_handler(event, context):
    try:
        equipment_id = event['pathParameters']['id']
        body = json.loads(event['body'])
        equipment_name = body.get('name')
        equipment_description = body.get('description')

        update_expression = "SET #n = :name, #d = :description"
        expression_attribute_names = {'#n': 'name', '#d': 'description'}
        expression_attribute_values = {':name': equipment_name, ':description': equipment_description}

        table.update_item(
            Key={
                'contentType': 'equipment',
                'id': equipment_id
            },
            UpdateExpression=update_expression,
            ExpressionAttributeNames=expression_attribute_names,
            ExpressionAttributeValues=expression_attribute_values
        )

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': 'Equipment updated successfully'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': str(e)})
        }