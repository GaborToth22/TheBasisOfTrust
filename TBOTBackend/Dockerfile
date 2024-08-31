FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-env
WORKDIR /App

EXPOSE 5263

COPY . ./
RUN dotnet restore

RUN dotnet publish -c Release -o out


# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /App
COPY --from=build-env /App/out .


ENTRYPOINT ["dotnet", "TBOTBackend.dll"]

ENV ASPNETCORE_URLS=http://+:5263/