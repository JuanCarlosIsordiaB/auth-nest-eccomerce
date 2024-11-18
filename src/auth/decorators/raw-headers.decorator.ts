import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
export const RawHeader = createParamDecorator(
    (data, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        

        if(!request)throw new InternalServerErrorException('Request not found');
            
        return (!data) ? 'No RawHeader Provided' : request[data];
        
    }
);
