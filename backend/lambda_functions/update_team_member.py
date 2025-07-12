import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('DnaWebContent')

def lambda_handler(event, context):
    try:
        member_id = event['pathParameters']['id']
        body = json.loads(event['body'])
        member_name = body.get('name')
        member_role = body.get('role')
        member_description = body.get('description')

        update_expression = "SET #n = :name, #r = :role, #d = :description"
        expression_attribute_names = {'#n': 'name', '#r': 'role', '#d': 'description'}
        expression_attribute_values = {':name': member_name, ':role': member_role, ':description': member_description}

        table.update_item(
            Key={
                'contentType': 'teamMember',
                'id': member_id
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
            'body': json.dumps({'message': 'Team member updated successfully'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': str(e)})
        }