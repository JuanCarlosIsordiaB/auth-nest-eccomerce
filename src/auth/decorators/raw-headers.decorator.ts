import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
export const RawHeader = createParamDecorator(
    (data, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const headers = request.rawHeaders;
        

        if(!request)throw new InternalServerErrorException('Request not found');
        //if(!headers)throw new InternalServerErrorException('Headers not found');
        //return headers;

        return (!data) ? 'No RawHeader Provided' : request[data];
        
    }
);
